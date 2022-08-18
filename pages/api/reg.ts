import type {NextRequest} from 'next/server'
import {emailTest} from "../../src/utils";

// check tokens
if (!process.env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is not set');
}
if (!process.env.GITHUB_ORG) {
    throw new Error('GITHUB_ORG is not set');
}

export const config = {
    runtime: 'experimental-edge',
}


export default async function handler(
    req: NextRequest
): Promise<Response> {
    if (req.method !== 'POST') {
        return new Response('Method not allowed', {status: 405, headers: {'Content-Type': 'application/json'}});
    }
    const email = await req.text()
    const {result, message} = emailTest(email)
    if (!result) {
        return new Response(JSON.stringify({message}), {status: 400, headers: {'Content-Type': 'application/json'}})
    }

    const pending_resp_data: any[] = await fetch(`https://api.github.com/orgs/${process.env.GITHUB_ORG}/invitations`, {
        method: 'GET',
        headers: {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github+json',
        },
    }).then(res => res.json())

    if (pending_resp_data.some(invitation => invitation.email === email)) {
        return new Response(JSON.stringify({message: '已发送邀请'}), {
            status: 201,
            headers: {'Content-Type': 'application/json'}
        })
    }

    const invite_resp = await fetch(`https://api.github.com/orgs/${process.env.GITHUB_ORG}/invitations`, {
        method: 'POST',
        headers: {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github+json',
        },
        body: JSON.stringify({
            email,
        })
    })
    if (!invite_resp.ok) {
        return new Response(JSON.stringify({message: '邀请发送失败，请联系管理员'}), {
            status: 500,
            headers: {'Content-Type': 'application/json'}
        })
    }

    return new Response(JSON.stringify({message: '已发送邀请'}), {
        status: 201,
        headers: {'Content-Type': 'application/json'}
    })
}
