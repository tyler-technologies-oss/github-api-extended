import HTTP from "./http";

export default class OrgAPI {
  constructor(private httpservice: HTTP, private config: IGitHubApi) {}

  public get(org: string): Promise<IObject> {
    const url = new URL(`${this.config.url}/orgs/${org}`);
    return this.httpservice.get(url);
  }

  public teams(org: string): Promise<IObject> {
    const url = new URL(`${this.config.url}/orgs/${org}/teams`);
    return this.httpservice.get(url);
  }

  public members(org: string): Promise<IObject> {
    const url = new URL(`${this.config.url}/orgs/${org}/members`);
    return this.httpservice.get(url);
  }
}
