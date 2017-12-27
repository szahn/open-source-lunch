const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_MAX_USER_COUNT = 1000;

const usaRegionNameFormatter = (region) =>`${region.city}, ${region.region}`;

/*Search github users with a particular location, where the user is a personal account (not an organization), has at least 1 follower and repository ordered by number of followers desc. Return 100 users per page on a 1-based page index*/
const githubUserSearchByRegionUrl = (region, greaterThanRepos, greaterThanFollowers, page, perPage) => 
    `${GITHUB_API_URL}/search/users?q=location:%22${usaRegionNameFormatter(region)}%22+type:user+repos:%3E${greaterThanRepos}+followers:%3E${greaterThanFollowers}&sort=followers&order=desc&per_page=${perPage}&page=${1+page}`;

export default (region, page) => $.get(githubUserSearchByRegionUrl(region, 0, 0, page, 100)).then((res)=>{
    if (!res || !res.items) {return [];}

    return {
        total: Math.min(GITHUB_MAX_USER_COUNT, res.total_count),
        users: res.items.map((item)=> {
            return {
                name: item.login,
                imageUrl: item.avatar_url
            }
        })
    };
});