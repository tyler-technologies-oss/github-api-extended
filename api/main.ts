import HTTP from './http';
import PullRequestAPI from './pullrequests';
import WorkflowAPI from './workflows';
import AccountAPI from './accounts';
import ReleaseAPI from './releases';
import SecurityAPI from './security';
import CommitAPI from './commits';

export default class GitHubAPI {
    public httpclient: HTTP;
    
    public workflows: WorkflowAPI;
    public pullrequests: PullRequestAPI;
    public accounts: AccountAPI;
    public releases: ReleaseAPI;
    public security: SecurityAPI;
    public commits: CommitAPI;
    
    constructor(private config: IGitHubApi) {
        this.httpclient = new HTTP(this.config);
        this.workflows = new WorkflowAPI(this.httpclient, this.config);
        this.pullrequests = new PullRequestAPI(this.httpclient, this.config);
        this.accounts = new AccountAPI(this.httpclient, this.config);
        this.releases = new ReleaseAPI(this.httpclient, this.config);
        this.security = new SecurityAPI(this.httpclient, this.config);
        this.commits = new CommitAPI(this.httpclient, this.config);
    }
}