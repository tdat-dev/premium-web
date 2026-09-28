# Pattern family: Auth, onboarding, and account

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

## Scope

In: sign-in/sign-up (password, magic link, one-time code, SSO/SAML, Google, Zalo), MFA, recovery, session-expiry re-auth, first-run onboarding (workspace, invites, import, checklist, sample data, tours), profile, organization settings, members, billing entry, API tokens, account deletion.

Elsewhere: field anatomy, validation, save semantics → [forms-wizards-settings.md](forms-wizards-settings.md). Toasts, banners, and error surfaces → [feedback-states-notifications.md](feedback-states-notifications.md). Roles and auth-event audit → [permissions-roles-audit.md](permissions-roles-audit.md). Account menu placement → [app-shell-navigation.md](app-shell-navigation.md). Required state coverage → [dashboard-product-contract.md](../../dashboard-product-contract.md).

## Choose the variant

| Observable predicate | Sign-in variant |
|---|---|
| Consumer or SMB product, no enterprise tenants | Single page: provider buttons (Google; Zalo for VN) above email and password |
| Any customer organization has its own IdP | Identifier-first: email → SSO by domain, else password/code |
| Monthly-or-rarer use, forgotten passwords | Passwordless: magic link or code first, password optional |
| Phone is the primary identity (VN consumer, delivery, field staff) | Phone number → one-time code; email optional later |
| One-off transaction, nothing to return to | No account: reference number plus emailed receipt (GOV.UK) |

| Observable predicate | First-run variant |
|---|---|
| Product is empty until the user brings data (CRM, analytics) | Setup checklist + import path + optional sample data |
| Useful on day one with no data (editor, calculator) | No onboarding flow; working surface with a designed empty state |
| Value depends on teammates (inbox, work management) | Workspace name → invite step (skippable) → first object |
| Genuinely novel interaction (canvas, spatial) | Contextual tip at first use of each tool, no upfront carousel |

## Anatomy

**Sign-in page (single).** Product mark → "Sign in to <product>" → provider buttons naming the provider ("Continue with Google") → "or" divider → email (`type="email"`, `autocomplete="username"`) → password (`autocomplete="current-password"`) with show toggle → "Forgot password?" beside the password label → "Sign in" → "New here? Create an account" → legal footer. No carousel, no testimonial.

**Identifier-first.** Step 1: email + "Continue". Step 2: SSO redirect notice ("Taking you to Acme's sign-in page"), password, or code, with the entered email shown and a "Change" link.

**Create account.** Own route, never tabbed beside sign-in. Name → email → one password field (`autocomplete="new-password"`, rules visible on focus) → consent checkbox only where law requires → "Create account". Verify email after first use when risk allows.

**One-time code screen.** "We sent a code to <masked destination>" → single input (`inputmode="numeric"`, `autocomplete="one-time-code"`), not split boxes → "Continue" → "Send a new code" (disabled with visible countdown) → "Use another method".

**MFA enrollment.** Method choice (passkey, authenticator app, SMS as fallback) → setup step (QR code plus manual key in monospace, copy button) → verify code → recovery codes screen with download/copy and a required "I've saved these" confirmation.

**Re-auth modal (session expiry).** Dialog over the preserved page: "Your session ended. Sign in again to keep working." → identity shown, locked → password/SSO/passkey → "Sign in" → secondary "Sign out". Unsaved input survives and resubmits.

**Setup checklist.** Progress title ("3 of 5 done") → ordered tasks: status, name, one-line why, action → "Hide checklist" (reopen from help menu).

**Account area.** Left sub-nav or tabs: Profile → Sign-in & security (password, MFA, passkeys, active sessions with "Sign out" per session) → Notifications → API tokens → Delete account (last, in its own section).

**Organization area.** General (name, slug, logo) → Members (table: person, role, status, last active, row menu) → Invites pending (resend, revoke, expiry date) → Plan & billing (current plan, usage vs limit, next invoice, "Change plan", "Manage payment") → Security (SSO config, domain verification, enforced MFA) → Danger zone.

**API token creation.** Name → scopes (least privilege default) → expiry ("No expiry" only by explicit choice) → "Create token" → one-time reveal: monospace token, copy button, "You won't see this token again" → list shows name, prefix only, scopes, last used, expiry, "Revoke".

**Account deletion.** Plain consequence list (what is deleted, what is kept for legal reasons, fate of owned workspaces) → blockers first ("Transfer ownership of 2 workspaces") → type-to-confirm or re-auth → grace period statement and cancellation route.

## Behavior and states

- Sign-in errors never reveal whether an account exists: "Email or password is incorrect". Password reset always answers "If an account exists, we sent a link".
- Account lockout states the wait time and the recovery route, not "Too many attempts".
- Magic links work in any browser; the expired-link screen offers "Send a new link" prefilled.
- Codes: accept pasted input with spaces or hyphens; check length before the server call; GOV.UK uses 15-minute validity.
- SSO: on IdP error show the organization name and "Ask your IT admin", not the raw SAML error. Where SSO is enforced for a domain, hide the password path.
- Social sign-in matching an existing password account: link after proving ownership, never auto-merge.
- Session expiry: in long-form surfaces warn first ("You'll be signed out in 2 minutes. Stay signed in"); re-auth in place, return to the same route and scroll.
- Invites: signed-out invitee sees inviter and workspace names; signed in as another email sees "This invite was sent to a@x.com. You're signed in as b@y.com" plus switch account. Expired or revoked invites say so and name who to ask.
- Onboarding: skippable except steps the product cannot run without; progress persisted server-side. Sample data labeled "Sample" on every record, removable in one action.
- Tours: pull revelations (help at the moment the user reaches the feature) over push tours at launch. One tip at a time, on a visible element; dismissals stick (Primer caps concurrent announcements at two).
- Last owner cannot leave, be demoted, or delete the account until ownership moves.
- Plan limits: inline notice at 80%; at 100% name the blocked action and link "Change plan". Non-billing roles see "Ask an owner to upgrade".

## Keyboard and accessibility

- Forms: native `<form>`, real labels, `autocomplete` tokens as above so password managers and OTP autofill work; paste always allowed (NIST 800-63B).
- Show-password control is a `<button>` with `aria-pressed`, or a checkbox; announce state.
- Re-auth and delete confirmation follow the WAI-ARIA APG Dialog (Modal) pattern: focus into first field, Tab trapped, Escape closes only if closing is safe, focus returns to the trigger.
- Onboarding tips are non-modal: reachable by Tab, closed by Escape, never trapping focus.
- Checklist progress is text, not only a ring.
- No CAPTCHA (GOV.UK); use risk-based checks with an accessible fallback.
- Timeouts: give warning and a way to extend (WCAG 2.2.1 Timing Adjustable).

## Responsive transformation

- Sign-in: single column, full-width provider buttons; identifier-first suits phone keyboards. Code input stays one field.
- Onboarding checklist: side panel on desktop → collapsible card at top of home on phones.
- Account/org sub-nav: vertical list → drill-in list page.
- Members table: person and role stay; last active and status move to a second line.

## Defaults

- Password minimum 8 characters with MFA, 15 without; accept at least 64; no composition rules; check against breached-password list (NIST 800-63B).
- Session: re-auth inactivity 1 hour, absolute 24 hours for moderate-assurance business apps (NIST AAL2); consumer apps may keep 30 days (AAL1).
- Resend code cooldown 30–60 seconds (convention).
- Magic link validity 10–15 minutes, single use (convention).
- Invite expiry 7 days (convention), resendable.
- Recovery codes: 8–10 single-use codes (convention).
- Checklist length 3–6 tasks (convention).
- Account deletion grace period 14–30 days (convention).

## Anti-patterns

- **Marketing hero on the sign-in page**: pushes the form down for returning users. P2.
- **Sign-in and sign-up tabs on one card**: wrong-tab "account exists" loops. P2.
- **Confirm-password field**: raises abandonment; use show-password. P2.
- **Split one-box-per-digit OTP**: breaks paste, autofill, and screen readers. P1.
- **Hidden password rules revealed only on error**. P2.
- **Account enumeration in errors**: security defect. P1.
- **Session expiry that discards unsaved input**: data loss. P1.
- **Mandatory product tour at first launch**: skipped, nothing retained. P2.
- **Unlabeled sample data among real records**: fake data gets exported or reported. P1.
- **API token visible again after creation, or listed in full**. P1.
- **One-click account deletion without consequences or ownership transfer**. P1.

## Coverage additions

- [ ] Sign-in: wrong password, locked, SSO-enforced domain, IdP error, unverified email, expired magic link/code.
- [ ] Re-auth in place, unsaved form preserved, same route.
- [ ] Invite: signed-out, signed-in as different user, expired, revoked, already a member.
- [ ] First run: empty, sample data on/off, checklist resumed on second device, all steps skipped.
- [ ] MFA: enroll, lose device → recovery code, admin-enforced MFA on next sign-in.
- [ ] Last owner leave/demote/delete blocked with explanation.
- [ ] Plan limit at 80% and 100%, viewed by owner and by non-billing member.
- [ ] Token create (one-time reveal), revoke, expired token.
- [ ] Account deletion with owned workspaces, grace-period cancel.
- [ ] Vietnamese: Zalo/phone sign-in path; full-diacritic names in avatars and member sort; labels ~20–35% longer.

## Sources

- https://design-system.service.gov.uk/patterns/create-accounts/ (accessed 2026-09-28)
- https://design-system.service.gov.uk/patterns/confirm-a-phone-number/ (accessed 2026-09-28)
- https://pages.nist.gov/800-63-4/sp800-63b.html (accessed 2026-09-28)
- https://web.dev/articles/sign-in-form-best-practices (accessed 2026-09-28)
- https://auth0.com/docs/authenticate/login/auth0-universal-login/identifier-first (accessed 2026-09-28)
- https://www.nngroup.com/articles/password-creation/ (accessed 2026-09-28)
- https://www.nngroup.com/articles/mobile-app-onboarding/ (accessed 2026-09-28)
- https://www.nngroup.com/articles/onboarding-tutorials/ (accessed 2026-09-28)
- https://www.nngroup.com/articles/empty-state-interface-design/ (accessed 2026-09-28)
- https://primer.style/product/ui-patterns/feature-onboarding (accessed 2026-09-28)
- Practitioner knowledge: invite edge cases, token reveal, last-owner rule, deletion grace period, Zalo/phone-first identity in Vietnam.
