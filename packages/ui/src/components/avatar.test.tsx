// If import errors, adjust the path to the Avatar component file accordingly.
// e.g., replace: import { Avatar, AvatarImage, AvatarFallback } from "./avatar";

/**
 * Test library/framework: We use Testing Library for React with the project's configured test runner
 * (Jest or Vitest). These tests rely only on public interfaces and mock external Radix primitives.
 */
import React from "react"

// Detect runner: prefer Vitest globals if available, else Jest.
let testApi: any
try {
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const v = require("vitest")
  testApi = v
} catch {
  // @ts-ignore
  testApi = globalThis as any
}

const { describe, it, test, expect, beforeEach } = testApi

// Mock Radix Avatar primitives to make tests deterministic and not depend on Radix internals.
const mockModule = {
  Root: React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function Root(
    { className = "", ...props },
    ref
  ) {
    return <div data-mock="avatar-root" ref={ref} className={className} {...props} />
  }),
  Image: React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(function Image(
    { className = "", ...props },
    ref
  ) {
    return <img data-mock="avatar-image" ref={ref} className={className} {...props} />
  }),
  Fallback: React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(function Fallback(
    { className = "", ...props },
    ref
  ) {
    return <span data-mock="avatar-fallback" ref={ref} className={className} {...props} />
  }),
}
let unmock: (() => void) | undefined

try {
  // Vitest-style mock
  if (testApi.vi) {
    // @ts-ignore
    const mod = await (async () => {
      testApi.vi.mock("@radix-ui/react-avatar", () => mockModule)
      return import("@radix-ui/react-avatar")
    })()
    unmock = () => testApi.vi?.resetModules?.()
  } else if (testApi.jest) {
    // Jest-style mock
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    jest.mock("@radix-ui/react-avatar", () => mockModule)
    unmock = () => jest.resetModules()
  }
} catch {
  // If mocking fails, tests will still run but hit the real module.
}

// Import component under test after mocking
// Note: path is adjusted at build-time by tsconfig path aliases if present.
import { Avatar, AvatarImage, AvatarFallback } from "./avatar"

import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"

describe("Avatar component suite", () => {
  beforeEach(() => {
    // no-op cleanup between tests is handled by @testing-library/react
  })

  it("renders Avatar with default classes and merges custom className", () => {
    render(<Avatar data-testid="avatar" className="custom-class" />)
    const el = screen.getByTestId("avatar")
    expect(el).toBeInTheDocument()
    // The implementation uses default classes: "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full"
    // We assert presence of key tokens rather than exact string ordering.
    expect(el).toHaveClass("relative")
    expect(el).toHaveClass("flex")
    expect(el).toHaveClass("h-10")
    expect(el).toHaveClass("w-10")
    expect(el).toHaveClass("shrink-0")
    expect(el).toHaveClass("overflow-hidden")
    expect(el).toHaveClass("rounded-full")
    expect(el).toHaveClass("custom-class")
  })

  it("forwards ref to underlying element for Avatar", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Avatar data-testid="avatar" ref={ref} />)
    const el = screen.getByTestId("avatar")
    expect(ref.current).toBe(el)
  })

  it("passes arbitrary props through to Avatar root", () => {
    render(<Avatar data-testid="avatar" aria-label="user avatar" data-foo="bar" />)
    const el = screen.getByTestId("avatar")
    expect(el).toHaveAttribute("aria-label", "user avatar")
    expect(el).toHaveAttribute("data-foo", "bar")
  })

  it("renders AvatarImage with default classes and merges className", () => {
    render(<AvatarImage data-testid="avatar-image" className="img-class" alt="u" src="x.png" />)
    const img = screen.getByTestId("avatar-image")
    expect(img).toBeInTheDocument()
    // Defaults: "aspect-square h-full w-full"
    expect(img).toHaveClass("aspect-square")
    expect(img).toHaveClass("h-full")
    expect(img).toHaveClass("w-full")
    expect(img).toHaveClass("img-class")
    expect(img).toHaveAttribute("alt", "u")
    expect(img).toHaveAttribute("src", "x.png")
  })

  it("forwards ref to underlying element for AvatarImage", () => {
    const ref = React.createRef<HTMLImageElement>()
    render(<AvatarImage data-testid="avatar-image" ref={ref} alt="" />)
    const img = screen.getByTestId("avatar-image")
    expect(ref.current).toBe(img)
  })

  it("renders AvatarFallback with default classes and merges className", () => {
    render(<AvatarFallback data-testid="avatar-fallback" className="fb-class">FB</AvatarFallback>)
    const fb = screen.getByTestId("avatar-fallback")
    expect(fb).toBeInTheDocument()
    // Defaults: "flex h-full w-full items-center justify-center rounded-full bg-muted"
    expect(fb).toHaveClass("flex")
    expect(fb).toHaveClass("h-full")
    expect(fb).toHaveClass("w-full")
    expect(fb).toHaveClass("items-center")
    expect(fb).toHaveClass("justify-center")
    expect(fb).toHaveClass("rounded-full")
    expect(fb).toHaveClass("bg-muted")
    expect(fb).toHaveClass("fb-class")
    expect(fb).toHaveTextContent("FB")
  })

  it("forwards ref to underlying element for AvatarFallback", () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(<AvatarFallback data-testid="avatar-fallback" ref={ref}>X</AvatarFallback>)
    const fb = screen.getByTestId("avatar-fallback")
    expect(ref.current).toBe(fb)
  })

  it("does not strip unknown HTML attributes (robust cn + passthrough)", () => {
    render(<Avatar data-testid="avatar" data-x="1" role="img" />)
    const el = screen.getByTestId("avatar")
    expect(el).toHaveAttribute("data-x", "1")
    expect(el).toHaveAttribute("role", "img")
  })
})

describe("Display names", () => {
  it("exposes displayName aligned with Radix primitives", () => {
    // The wrappers set displayName = Primitive.displayName
    // We just assert they are defined strings to prevent regressions.
    expect(Avatar.displayName).toBeTruthy()
    expect(AvatarImage.displayName).toBeTruthy()
    expect(AvatarFallback.displayName).toBeTruthy()
  })
})