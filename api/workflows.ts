import HTTP from "./http";

export default class WorkflowAPI {
  constructor(private httpservice: HTTP, private config: IGitHubApi) {}

  public async get(): Promise<IObject[]> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/actions/workflows`
    );

    const response = await this.httpservice.get(url);
    const workflows =  response?.data?.workflows || [];
    // Remove Dependabot Updates workflow or ones that have no content
    return workflows.filter((wf: IObject) => wf.name !== "Dependabot Updates" && wf.content?.trim() !== "");
  }

  public async contents(path: string): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/contents/${path}`
    );
    const response = await this.httpservice.get(url);
    return response?.data || [];
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
    let workflows =  result?.data?.workflow_runs || [];

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
    // Filter by status if provided
    if (status) {
      return result?.data?.jobs.filter((job: IObject) => job.conclusion === status.valueOf()) || [];
    }
    return result?.data?.jobs || [];
  }
}
