# Arkadium Family Feud – In-Game Landing Menu & Style Notes

> Observations taken from Arkadium's Family Feud web game landing screen (desktop capture, November 2025). Notes highlight visual language, layout, and interaction patterns to guide our own implementation. No proprietary art reproduced.

## Layout Overview
- **Full-screen stage backdrop** with vignette edges and parallax light beams pointing toward the center logo.
- **Top left**: hamburger menu icon (three horizontal white bars) for secondary navigation/settings.
- **Top right**: Arkadium brand tag (white rounded rectangle with logo) acting as outbound link/home.
- **Center stage**: dominant Family Feud logo with 3D bevel, gold/orange text, blue oval plaque.
- **Below logo**: circular avatar placeholder and "Sign in" link before primary CTA.
- **Primary CTA**: large "PLAY" button centered near bottom third with glowing blue gradient.
- **Footer right**: small build/version number (`1.3.47`).

## Color & Lighting
- Background gradient transitions from deep navy (`#03045e`) at edges to electric blue (`#1e3a8a`) near center.
- Spotlights rendered with cyan beams (`#60a5fa` with alpha) to create stage ambience.
- Logo palette: gold (`#fbbf24`) with orange stroke (`#d97706`), outer blue ring (`#1d4ed8`), inner glow (`#2563eb` to `#60a5fa`).
- CTA button gradient: top `#1d4ed8`, bottom `#0f172a`, subtle inner glow at top edge; outer stroke `#2563eb`.
- Sign-in text uses bright yellow (`#FACC15`) with underline on hover.

## Typography & Iconography
- **Logo**: Custom Family Feud serif with bevel/extrusion.
- **Menu Icon**: Simple white bars with slight drop shadow.
- **CTA Label**: All-caps sans-serif, bold, letter spacing ~1px.
- **Sign In Link**: Upper/lower-case sans-serif, smaller size than CTA, color-coded for action.

## Interaction Cues
- Hovering the Play button raises it slightly, increases glow intensity.
- Avatar circle pulses lightly when hovered, inviting sign-in.
- Hamburger menu animates to a close icon once expanded (in-game).

## Composition & Spacing
- Logo anchored to center; vertical spacing ensures "Family" sits close to top third.
- Avatar circle sized ~120px diameter with teal ring (#14b8a6) around darker silhouette.
- CTAs spaced with ~24px vertical gap.

## Audio/Feedback (inferred)
- Ambient audience sound loops on landing screen.
- Button click triggers short fanfare.

## Elements to Consider for Our Project
1. **Hero Atmosphere**: replicate stage lighting via radial gradients and overlay beams.
2. **CTA Styling**: pill or rounded rectangles with strong glow to evoke game-show energy.
3. **Avatar Placeholder**: use teal circle and silhouette to match login prompt.
4. **Menu Placement**: consider hamburger + brand logo for upper corners.
5. **Version Tag & Footer**: small build label for QA.

## Accessibility Notes
- Contrast: yellow "Sign in" on dark blue meets contrast (~7:1). White hamburger on navy also compliant.
- CTA text on dark gradient is legible; ensure accessible focus outlines when we reimplement.

