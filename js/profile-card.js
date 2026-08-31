window.addEventListener("DOMContentLoaded", async function () {
    const enableLogging = true;
    async function get(url, cacheDuration = 60 * 60 * 1000) {
        const cacheKey = `api-cache:${url}`;
        const cachedRaw = localStorage.getItem(cacheKey);

        if (cachedRaw) {
            try {
                const cached = JSON.parse(cachedRaw);

                const isFresh =
                    Date.now() - cached.timestamp < cacheDuration;

                if (isFresh) {
                    if (enableLogging) {
                        console.log(`Using cached data for: ${url}`);
                    }

                    return cached.data;
                }
            } catch (error) {
                console.warn("Invalid cached data, removing it:", error);
                localStorage.removeItem(cacheKey);
            }
        }

        try {
            if (enableLogging) {
                console.log(`Fetching fresh data from: ${url}`);
            }

            const resp = await fetch(url);

            if (!resp.ok) {
                console.error(
                    `Error fetching data from ${url}: ${resp.status} ${resp.statusText}`
                );

                // GitHub rate limit or temporary API error:
                // use expired cache if available
                if (cachedRaw) {
                    try {
                        const cached = JSON.parse(cachedRaw);

                        console.warn(
                            `API unavailable. Using stale cached data for: ${url}`
                        );

                        return cached.data;
                    } catch (error) {
                        console.error("Could not use stale cache:", error);
                    }
                }

                throw new Error(`HTTP error! status: ${resp.status}`);
            }

            const data = await resp.json();

            localStorage.setItem(
                cacheKey,
                JSON.stringify({
                    timestamp: Date.now(),
                    data: data
                })
            );

            if (enableLogging) {
                console.log(`Cached fresh data for: ${url}`);
            }

            return data;

        } catch (error) {
            // Covers fetch/network errors too
            if (cachedRaw) {
                try {
                    const cached = JSON.parse(cachedRaw);

                    console.warn(
                        `Network/API error. Using stale cache for: ${url}`
                    );

                    return cached.data;
                } catch (cacheError) {
                    console.error("Could not read cached data:", cacheError);
                }
            }

            throw error;
        }
    }

    document.querySelectorAll(".stack-card").forEach(async function (el) {
        try {
            const userId = el.getAttribute("user-id");
            if (!userId) {
                console.warn("User ID not found for stack-card element", el);
                return;
            }
            if (enableLogging) console.log(`Fetching Stack Overflow data for user ID: ${userId}`);
            
            const response = await get(`https://api.stackexchange.com/2.2/users/${userId}?site=stackoverflow`);
            if (response.items.length === 0) {
                console.warn(`No user found for user ID: ${userId}`);
                return;
            }
            if (enableLogging) console.log(`Received data for user ID: ${userId}`, response.items[0]);

            const user = response.items[0];
            const { profile_image, website_url, link, display_name, reputation, user_id } = user;
            const { gold, silver, bronze } = user.badge_counts;

            el.innerHTML = `
                <div style="font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji; border-radius: 6px; line-height: 1.5; padding: 16px; font-size: 14px; color: #24292e; background-color: var(--background-light);">
                    <div style="display: flex; align-items: center;">
                        <img style="width: 48px; height: 48px; border-radius: 50%" src="${profile_image}" alt="Profile image"></img>
                        <div style="display: flex; flex-direction: column; margin-left: 12px">
                            <span style="font-weight: 500; color: #000; font-size: 18px">
                                <a style="text-decoration: none; color: inherit;" target="_blank" href="${website_url && link}">
                                    ${display_name}
                                </a>
                            </span>
                            <span style="font-weight: 400; color: #586069; font-size: 12px">
                                @${link.replace("https://", '').replace(`/users/${user_id}`,'')}
                            </span>
                        </div>
                    </div>
                    <div style="margin-top: 12px; display: flex; justify-content: space-evenly; align-items: center; ">
                        <div style="margin-top: -4px">
                            <span style="font-size: 10px; font-weight: 500; color: #586069;">
                                REPUTATION
                            </span>
                            <div style="font-weight: 400; color: #211F1F; font-size: 12px; margin-top: 2px">
                                <span style="font-weight: 600; color: #211F1F; font-size: 32px; line-height: 1;">
                                    ${reputation}
                                </span>
                            </div>
                        </div>
                        <div style="margin-top: -4px">
                            <span style="font-size: 10px; font-weight: 500; color: #586069;">
                                BADGES
                            </span>
                            <div style="font-weight: 400; color: #211F1F; font-size: 12px; margin-top: 2px">
                                <span style="font-weight: 600; color: #211F1F; font-size: 32px; line-height: 1;">
                                    ${Number(gold) + Number(silver) + Number(bronze)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            if (enableLogging) console.log(`Stack Overflow card updated for user ID: ${userId}`);
        } catch (error) {
            console.error('Error processing stack-card element:', error);
        }
    });

    document.querySelectorAll(".github-card").forEach(async function (el) {
        try {
            const username = el.getAttribute("username");
            if (!username) {
                console.warn("GitHub username not found for github-card element", el);
                return;
            }
            if (enableLogging) console.log(`Fetching GitHub data for username: ${username}`);
            
            const response = await get(`https://api.github.com/users/${username}`);
            if (enableLogging) console.log(`Received GitHub data for username: ${username}`, response);
            
            const { name, avatar_url, public_repos, followers, html_url, following } = response;

            el.innerHTML = `
                <div style="font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji; border-radius: 6px; line-height: 1.5; padding: 16px; font-size: 14px; color: #24292e; background-color: var(--background-light);">
                    <div style="display: flex; align-items: center; margin-top: -4px">
                        <img style="width: 48px; height: 48px; border-radius: 50%" src="${avatar_url}" alt="Profile image"></img>
                        <div style="display: flex; flex-direction: column; margin-left: 12px">
                            <span style="font-weight: 500; color: #000; font-size: 18px">
                                <a style="text-decoration: none; color: inherit;" target="_blank" href="${html_url}">
                                    ${name}
                                </a>
                            </span>
                            <span style="font-weight: 400; color: #586069; font-size: 12px">
                                @${html_url.replace('https://', '')}
                            </span>
                        </div>
                    </div>
                    <div style="margin-top: 12px; display: flex; justify-content: space-evenly; align-items: center; ">
                        <div style="display: flex; flex-direction: column;">
                            <span style="font-size: 10px; font-weight: 500; color: #586069;">
                                REPOSITORIES
                            </span>
                            <span style="font-weight: 600; color: #211F1F; font-size: 32px; line-height: 1">
                                ${public_repos}
                            </span>
                        </div>
                        <div style="display: flex; flex-direction: column;">
                            <span style="font-size: 10px; font-weight: 500; color: #586069;">
                                FOLLOWERS
                            </span>
                            <span style="font-weight: 600; color: #211F1F; font-size: 32px; line-height: 1">
                                ${followers}
                            </span>
                        </div>
                        <div style="display: flex; flex-direction: column;">
                            <span style="font-size: 10px; font-weight: 500; color: #586069;">
                                FOLLOWING
                            </span>
                            <span style="font-weight: 600; color: #211F1F; font-size: 32px; line-height: 1">
                                ${following}
                            </span>
                        </div>
                    </div>
                </div>
            `;
            if (enableLogging) console.log(`GitHub card updated for username: ${username}`);
        } catch (error) {
            console.error('Error processing github-card element:', error);
        }
    });
});