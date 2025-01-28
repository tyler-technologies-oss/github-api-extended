import HTTP from "./http";

export default class RatelimitAPI {
  constructor(private httpservice: HTTP, public config: IGitHubApi) {}

    public get(): Promise<IObject> {
        const url = new URL(`${this.config.url}/rate_limit`);
        return this.httpservice.get(url);
    }
}
