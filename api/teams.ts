import HTTP from "./http";

export default class TeamAPI {
  constructor(private httpservice: HTTP, private config: IGitHubApi) {}

  private createSlug(team: string): string {
    return team.replace(/ /g, "-").toLowerCase();
  }

  public members(org: string, team: string): Promise<IObject> {
    team = this.createSlug(team);
    const url = new URL(`${this.config.url}/orgs/${org}/teams/${team}/members`);
    return this.httpservice.get(url);
  }

  public find(org: string, team: string): Promise<IObject> {
    team = this.createSlug(team);
    const url = new URL(`${this.config.url}/orgs/${org}/teams/${team}`);
    return this.httpservice.get(url);
  }
}
