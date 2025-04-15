import HTTP from "./http";

export default class CommitAPI {
  constructor(private httpservice: HTTP, public config: IGitHubApi) {}
  

  public async get(sha: string, since: string, until: string): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/commits`
    );

    if (sha) url.searchParams.append("sha", sha);
    if (since) url.searchParams.append("since", since);
    if (until) url.searchParams.append("until", until);
  
    return this.httpservice.get(url);
  }

  public async find(sha: string) {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/commits/${sha}`
    );

    return this.httpservice.get(url);
  }
}