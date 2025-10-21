import HTTP from "./http";

export default class WorkflowAPI {
  constructor(private httpservice: HTTP, private config: IGitHubApi) {}

  public async get(): Promise<IObject[]> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/actions/workflows`
    );

    const response = await this.httpservice.get(url);
    const workflows = (response?.data && typeof response.data === 'object' && 'workflows' in response.data) 
      ? response.data.workflows || [] 
      : [];
    // Remove Dependabot Updates workflow or ones that have no content
    return workflows.filter((wf: IObject) => wf.name !== "Dependabot Updates" && wf.content?.trim() !== "");
  }

  public async contents(path: string): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/contents/${path}`
    );
    const response = await this.httpservice.get(url);
    return (response?.data && typeof response.data === 'object' && !Array.isArray(response.data)) 
      ? response.data as IObject 
      : {} as IObject;
  }

  public dispatch(id: number, body?: Body): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/actions/workflows/${id}/dispatches`
    );
    return this.httpservice.post(url, body || {}) as any;
  }

  public async viewRuns(id: number, status?: IWorkflowStatus, count = 10): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/actions/workflows/${id}/runs`
    );
    const result = await this.httpservice.get(url);
    let workflows = (result?.data && typeof result.data === 'object' && 'workflow_runs' in result.data) 
      ? result.data.workflow_runs || [] 
      : [];

    // Filter by status if provided
    if (status) {
      const filtered = workflows.filter((wf: IObject) => wf.conclusion === status.valueOf());
      workflows = filtered;
    }

    // Limit by count if provided
    if (count && !isNaN(count) && count > 0) {
      workflows = workflows.slice(0, count);
    }

    return workflows;
  }

  public async viewJobs(runId: number, status: IWorkflowStatus): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/actions/runs/${runId}/jobs`
    );
    const result = await this.httpservice.get(url);
    const jobs = (result?.data && typeof result.data === 'object' && 'jobs' in result.data) 
      ? result.data.jobs || [] 
      : [];
    // Filter by status if provided
    if (status) {
      return jobs.filter((job: IObject) => job.conclusion === status.valueOf()) || [];
    }
    return jobs;
  }

  public async viewJobLogs(jobId: number): Promise<any> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/actions/jobs/${jobId}/logs`
    );

    try {
      const response = await this.httpservice.get(url);
      const data = response?.data;

      if (typeof data === 'string') {
        // Check for expired logs or request errors
        if (data.includes('ETIMEDOUT')) {
              console.log(data);
          return 'Logs are no longer available. GitHub Actions logs expire after a certain period.';
        }

        const errorIndex = data.indexOf('##[error]');
        if (errorIndex !== -1) {
          const cleanupIndex = data.indexOf('Post job cleanup.', errorIndex);
          const endIndex = cleanupIndex !== -1 ? cleanupIndex : data.length;

          let errorSection = data.slice(errorIndex, endIndex);
          errorSection = errorSection.replace('##[error]', '');
          errorSection = errorSection.replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z\s*/g, '');
          errorSection = errorSection.trim();
          return errorSection || 'Error details not available.';
        }
      }

      return response?.data;
    } catch (error: any) {
      // Handle network timeouts and other errors
      if (error?.code === 'ETIMEDOUT' || error?.message?.includes('ETIMEDOUT')) {
        return 'Logs are no longer available. GitHub Actions logs expire after a certain period.';
      }

      // Generic error handling
      return `Failed to fetch logs: ${error?.message || 'Unknown error occurred.'}`;
    }
  }
}
