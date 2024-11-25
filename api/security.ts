import HTTP from "./http";

export default class SecurityAPI {
  constructor(private httpservice: HTTP, public config: IGitHubApi) {}

  public async getAlerts(): Promise<IObject> {
    let page = 1;
    let hasNextPage = true;
    const categorizedAlerts: { [category: string]: IObject[] } = {};
  
    while (hasNextPage) {
      // Set the URL with the mutable page number
      const url = new URL(
        `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/code-scanning/alerts`
      );

      url.searchParams.append("per_page", "100");
      url.searchParams.append("page", page.toString());
  
      const { data, headers } = await this.httpservice.get(url);
  
      // Ensure data is an array
      if (Array.isArray(data)) {
        data.forEach((alert: IObject) => {
          const category = alert.most_recent_instance?.category;
  
          if (!categorizedAlerts[category]) {
            categorizedAlerts[category] = [];
          }
  
          categorizedAlerts[category].push(alert);
        });
      }
  
      // Check for pagination link in headers
      const linkHeader = headers.get('link');
      hasNextPage = false; // Assume no next page unless proven otherwise
  
      if (linkHeader) {
        const links = linkHeader.split(',').map((header: string) => header.split(';'));
        const nextLink = links.find((link) => link[1].includes('rel="next"'));
  
        if (nextLink) {
          // Increment the page number for the next request
          page++;
          hasNextPage = true;
        }
      }
    }
  
    return categorizedAlerts;
  }

  public getAlert(id: number): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/code-scanning/alerts/${id}`
    ); 
    return this.httpservice.get(url);
  }

  public async getActiveAlerts(): Promise<IObject> {
    const alerts = await this.getAlerts();
    const activeAlerts: { [category: string]: IObject[] } = {};

    Object.keys(alerts).forEach((category) => {
        const active = alerts[category].filter((alert: IObject) => alert.state === 'open');

        if (active.length) {
            activeAlerts[category] = active;
        }
    });

    return activeAlerts;
  }

  public async getDismissedAlerts(): Promise<IObject> {
    const alerts = await this.getAlerts();
    const dismissedAlerts: { [category: string]: IObject[] } = {};

    Object.keys(alerts).forEach((category) => {
        const dismissed = alerts[category].filter((alert: IObject) => alert.state === 'dismissed');

        if (dismissed.length) {
            dismissedAlerts[category] = dismissed;
        }
    });

    return dismissedAlerts;
  }

  public updateAlert(id: number, state: string): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/code-scanning/alerts/${id}`
    );
    const body = {
      state
    };
    return this.httpservice.patch(url, body);
  }
}
