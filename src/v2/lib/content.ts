import type { Lab, Tool } from "@/v2/lib/types";

export const labs: Lab[] = [
  {
    slug: "htb-alert",
    title: "Alert — Easy Web Challenge",
    platform: "htb",
    difficulty: "easy",
    category: "Web",
    excerpt:
      "A simple XSS challenge on Hack The Box that teaches input sanitization bypass and cookie exfiltration fundamentals.",
    content: `## Overview

Alert is an easy-difficulty web challenge on Hack The Box focused on cross-site scripting. The application has a single input field that reflects user content without proper sanitization.

## Reconnaissance

The target runs a simple web application with a message submission feature. The input is reflected in the response HTML without encoding.

Key observations:
- No Content Security Policy headers
- Input is reflected inside an HTML tag without quotes or angle bracket encoding
- The application uses cookies for session management

## Approach

The exploitation path follows these steps:

1. Test basic XSS payloads to confirm reflection
2. Identify which characters are filtered
3. Craft a payload that bypasses the filter
4. Use the payload to exfiltrate the admin cookie
5. Use the admin cookie to retrieve the flag

## Key Takeaways

- Always test all input vectors, not just the obvious form fields
- Content Security Policy is a critical defense-in-depth mechanism
- Cookie flags (HttpOnly, Secure, SameSite) significantly reduce XSS impact`,
    tags: ["xss", "web", "htb", "cookie-theft"],
    date: "2026-04-15",
  },
  {
    slug: "thm-brooklyn",
    title: "Brooklyn — Nine Eleven",
    platform: "thm",
    difficulty: "medium",
    category: "Web",
    excerpt:
      "A TryHackMe room involving FTP enumeration, web application analysis, and privilege escalation through misconfigured SUID binaries.",
    content: `## Overview

Brooklyn Nine Nine is a medium-difficulty room on TryHackMe that covers FTP anonymous access, steganography, and multiple privilege escalation paths.

## Enumeration

Starting with an nmap scan reveals three open ports:
- FTP (21) with anonymous login enabled
- SSH (22)
- HTTP (80) running Apache

## Initial Access

The FTP server allows anonymous login and contains a note for Jake and a suspicious image file. The image uses steganography to hide SSH credentials.

## Privilege Escalation

Two paths to root:
1. SUID binary abuse
2. sudo misconfiguration with a wildcard

## Lessons Learned

- Always check FTP for anonymous access
- Steganography is a common CTF technique worth practicing
- Multiple privilege escalation paths often exist — check all of them`,
    tags: ["ftp", "steganography", "privesc", "thm"],
    date: "2026-04-10",
  },
  {
    slug: "pg-banzai",
    title: "Banzai — Full Pivot Chain",
    platform: "pg",
    difficulty: "hard",
    category: "Pivot",
    excerpt:
      "A Proving Grounds lab requiring multi-stage pivoting through network segments with custom tooling and tunnel management.",
    content: `## Overview

Banzai is a hard-difficulty Proving Grounds lab that requires chaining multiple pivots across network segments to reach the final objective.

## Attack Path

1. Initial foothold through a web application vulnerability
2. First pivot through a compromised server into an internal network
3. Second pivot through a database server
4. Final access to the target database

## Tooling

Custom scripts for managing multiple SSH tunnels and proxychains configurations.

## Key Takeaways

- Automated tunnel management reduces errors in complex pivot chains
- Always enumerate all interfaces on compromised hosts
- Document your pivot paths — you will need to retrace them`,
    tags: ["pivot", "tunneling", "network", "pg"],
    date: "2026-04-05",
  },
];

export const tools: Tool[] = [
  {
    slug: "recon-pipeline",
    name: "Recon Pipeline",
    description:
      "An automated reconnaissance pipeline that chains subfinder, httpx, and nuclei for rapid surface assessment.",
    githubUrl: "https://github.com/offseclabs/recon-pipeline",
    tags: ["reconnaissance", "automation", "go"],
  },
  {
    slug: "scope-manager",
    name: "Scope Manager",
    description:
      "A lightweight scope management tool for tracking authorized targets, exclusion lists, and engagement boundaries.",
    githubUrl: "https://github.com/offseclabs/scope-manager",
    tags: ["scope", "engagement", "typescript"],
  },
  {
    slug: "payload-kit",
    name: "Payload Kit",
    description:
      "A collection of encoded payloads and delivery templates for authorized web application testing scenarios.",
    githubUrl: "https://github.com/offseclabs/payload-kit",
    tags: ["payloads", "web", "python"],
  },
  {
    slug: "log-parser",
    name: "Log Parser",
    description:
      "Structured log parsing for extracting authentication events, error patterns, and anomalous access from common web server logs.",
    githubUrl: "https://github.com/offseclabs/log-parser",
    tags: ["logs", "analysis", "rust"],
  },
];
