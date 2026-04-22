//  APP Name: v6-sdk-test
//  create live account: email_computer@163.com
//  related  sandbox account: p-test-us-v6-2025@test.com (US Account)

const PAYPAL_SANDBOX_CLIENT_ID = "Aa9Fj_yJs0Ylv2ZxdwWd-5ATa8vNqnn8ykMXksfwk5TRR0zvu1XoTZRhrAvI5YtnyaIJrFSanfQUq-9O";
const PAYPAL_SANDBOX_CLIENT_SECRET = "ELMHpqnP61kMOWIiz0NF-xKTmBXehYcgl6fv5VVJOpe_Usm57VCnjosY0tD78dAVo2CXglhQ4GVJql87";
const DOMAINS = "";

export const getDefaultCredentials = () => {
    return {
        PAYPAL_SANDBOX_CLIENT_ID,
        PAYPAL_SANDBOX_CLIENT_SECRET,
        DOMAINS
    }
}