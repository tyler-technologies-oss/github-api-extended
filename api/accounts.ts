import HTTP from "./http";

export default class AccountAPI {
  constructor(private httpservice: HTTP, private config: IGitHubApi) {}

  public get(username: string): Promise<IObject> {
    const url = new URL(`${this.config.url}/users/${username}`);
    
    return this.httpservice.get(url);
  }
}
