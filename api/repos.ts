import HTTP from "./http";

export default class RepoAPI {
  constructor(private httpservice: HTTP, private config: IGitHubApi) {}

  public get(org: string, repo: string): Promise<IObject> {
    const url = new URL(`${this.config.url}/repos/${org}/${repo}`);
    return this.httpservice.get(url);
  }
}
