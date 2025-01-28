import HTTP from './http';
import PullRequestAPI from './pullrequests';
import WorkflowAPI from './workflows';
import AccountAPI from './accounts';
import ReleaseAPI from './releases';
import SecurityAPI from './security';
import CommitAPI from './commits';
import OrgAPI from './org';
import TeamAPI from './teams';
import TagAPI from './tags';
import RatelimitAPI from './ratelimit';

export default class GitHubAPI {
    public httpclient: HTTP;
    public workflows: WorkflowAPI;
    public pullrequests: PullRequestAPI;
    public accounts: AccountAPI;
    public releases: ReleaseAPI;
    public security: SecurityAPI;
    public commits: CommitAPI;
    public org: OrgAPI;
    public teams: TeamAPI;
    public tags: TagAPI;
    public ratelimit: RatelimitAPI;
    
    constructor(private config: IGitHubApi) {
        this.httpclient = new HTTP(this.config);
        this.workflows = new WorkflowAPI(this.httpclient, this.config);
        this.pullrequests = new PullRequestAPI(this.httpclient, this.config);
        this.accounts = new AccountAPI(this.httpclient, this.config);
        this.releases = new ReleaseAPI(this.httpclient, this.config);
        this.security = new SecurityAPI(this.httpclient, this.config);
        this.commits = new CommitAPI(this.httpclient, this.config);
        this.org = new OrgAPI(this.httpclient, this.config);
        this.teams = new TeamAPI(this.httpclient, this.config);
        this.tags = new TagAPI(this.httpclient, this.config);
        this.ratelimit = new RatelimitAPI(this.httpclient, this.config);
    }
}