import HTTP from "./http";

export default class PullRequestAPI {
  constructor(private httpservice: HTTP, public config: IGitHubApi) {}

  public list(): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/pulls`
    );
    return this.httpservice.get(url);
  }

  public get(pr_id: number): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/pulls/${pr_id}`
    );
    return this.httpservice.get(url);
  }

  public reviews(pr_id: number): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/pulls/${pr_id}/reviews`
    );
    return this.httpservice.get(url);
  }

  public updateState(
    body: IObject,
    commit_id: string,
    pr_id: number,
    event: string,
    comments: IObject
  ): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/pulls/${pr_id}/reviews`
    );
    return this.httpservice.post(url, { commit_id, body, event, comments });
  }

  public commits(pr_id: number): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/pulls/${pr_id}/commits`
    );
    return this.httpservice.get(url);
  }
}
