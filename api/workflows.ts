import HTTP from "./http";

export default class WorkflowAPI {
  constructor(private httpservice: HTTP, private config: IGitHubApi) {}

  public get(): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/actions/workflows`
    );
    const data = this.httpservice.get(url);
    const workflows = (data as any).workflows;
    return workflows;
  }

  public dispatch(id: number, body?: Body): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/actions/workflows/${id}/dispatches`
    );
    return this.httpservice.post(url, body || {}) as any;
  }
}
