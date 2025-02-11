import HTTP from "./http";

export default class WorkflowAPI {
  constructor(private httpservice: HTTP, private config: IGitHubApi) {}

  public get(): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/actions/workflows`
    );
    return this.httpservice.get(url);
  }

  public dispatch(id: number, body?: Body): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/actions/workflows/${id}/dispatches`
    );
    return this.httpservice.post(url, body || {});
  }
}
