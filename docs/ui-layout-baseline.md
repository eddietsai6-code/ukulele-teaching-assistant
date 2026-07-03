# UI Layout Baseline

UkuleleBook is an iPad-first teaching interface.

## Canonical Viewports

- Primary portrait baseline: iPad Air, `820px` wide by `1180px` high.
- Primary landscape baseline: iPad Air, `1180px` wide by `820px` high.

## Adaptation Rule

Design and QA start from the iPad baseline. Desktop and mobile layouts must follow the
same information hierarchy, teaching flow, component proportions, control grouping, and
visual rhythm unless a feature has an explicit product reason to diverge.

Desktop may add breathing room or wider columns, but it must not become a separate
desktop-first layout. Mobile may compress spacing and stack regions, but it must keep
the same order and interaction model as the iPad layout.

## Review Order

1. Validate iPad portrait at `820x1180`.
2. Validate iPad landscape at `1180x820`.
3. Check desktop as an expansion of the iPad layout.
4. Check mobile as a compressed version of the iPad layout.

New UI work should document any intentional exception before implementation.
