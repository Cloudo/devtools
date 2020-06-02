import { finder } from '@medv/finder'
import * as Dtl from '@testing-library/dom'
// import { isClickable } from './utils'

const listeners: Function[] = []

enum EventType {
  CLICK = 'click',
  CHANGE = 'change',
  DBCLICK = 'dbclick',
  KEYDOWN = 'keydown',
  SUBMIT = 'submit',
}

const isInput = (target: Element): target is HTMLInputElement => {
  return target.tagName === 'INPUT'
}

const isAnchor = (target: Element): target is HTMLAnchorElement => {
  return target.hasAttribute('href')
}

// const isButton = (target: Element): target is HTMLButtonElement => {
//   return target.tagName === 'BUTTON'
// }

const getParentWithTestId = (current: Element) => {
  let el = current as Element | null | undefined
  while ((el = el?.parentElement) && !el.hasAttribute('data-testid'));
  return el
}

type Selector = {
  value: string
  method:
    | 'findByLabelText'
    | 'findByPlaceholderText'
    | 'findByTestId'
    | 'findByText'
    | 'get'
  parent?: Selector
}

type ParsedEvent = {
  selector: Selector
  action: string
  tag: string
  value: string
  id?: string
  key?: string
  href?: string
  inputType?: string
}

const dtl = async (
  fn: (q: typeof Dtl) => Promise<HTMLElement[]>
): Promise<HTMLElement[]> => {
  let nodes: HTMLElement[] = []
  try {
    nodes = await fn(Dtl)
  } catch (e) {}
  return nodes
}

const getSelector = async (
  target: Element | null
  // root = document.body
): Promise<Selector | undefined> => {
  if (!target) return

  if (isInput(target)) {
    const label = target.labels?.length ? target.labels[0].textContent : ''
    if (label) {
      return { value: label, method: 'findByLabelText' }
    }
    if (target.placeholder) {
      return { value: target.placeholder, method: 'findByPlaceholderText' }
    }
  }

  if (target.hasAttribute('data-testid')) {
    const testId = target.getAttribute('data-testid')!

    let nodes = await dtl((q) => q.findAllByTestId(document.body, testId))
    if (nodes.length === 1) {
      return { value: testId, method: 'findByTestId' }
    }
    if (nodes.length > 1) {
      const parent = getParentWithTestId(target)
      if (parent) {
        const parentTestId = parent.getAttribute('data-testid')!
        nodes = await dtl((q) =>
          q.findAllByTestId(parent as HTMLElement, testId!)
        )
        if (nodes.length === 1) {
          return {
            value: testId,
            method: 'findByTestId',
            parent: { value: parentTestId, method: 'findByTestId' },
          }
        }
      }
    }
  }

  const text = target.textContent?.trim()
  if (text && text.length < 100) {
    let nodes = await dtl((q) => q.findAllByText(document.body, text!))
    // console.log(nodes)
    if (nodes.length === 1) {
      return { value: text, method: 'findByText' }
    }

    if (nodes.length > 1) {
      const parent = getParentWithTestId(target)
      if (parent) {
        const parentTestId = parent.getAttribute('data-testid')!
        nodes = await dtl((q) => q.findAllByText(parent as HTMLElement, text!))
        if (nodes.length === 1) {
          return {
            value: text,
            method: 'findByText',
            parent: { value: parentTestId, method: 'findByTestId' },
          }
        }
      }
    }
  }

  const parent = getParentWithTestId(target)
  if (parent) {
    const parentTestId = parent.getAttribute('data-testid')!

    const finderSelector = finder(target, {
      root: parent,
      attr: (name) => {
        return name === 'data-testid'
      },
    })
    return {
      value: finderSelector,
      method: 'get',
      parent: { value: parentTestId, method: 'findByTestId' },
    }
  }

  const finderSelector = finder(target, {
    attr: (name) => {
      return name === 'data-testid'
    },
  })
  return { value: finderSelector, method: 'get' }
}

const parseEvent = async (event: Event): Promise<ParsedEvent | null> => {
  const target = event.target as Element
  if (target.nodeName === 'BODY') return null

  const selector = await getSelector(target)
  if (!selector) return null

  const parsedEvent: ParsedEvent = {
    selector,
    action: event.type,
    tag: (event.target as Element).tagName,
    value: (event.target as HTMLInputElement).value,
  }
  if (isAnchor(target)) parsedEvent.href = target.href

  if (target.hasAttribute('id')) parsedEvent.id = target.id

  if (isInput(target)) parsedEvent.inputType = target.type

  if (event.type === 'keydown') parsedEvent.key = (event as KeyboardEvent).key

  return parsedEvent
}

// export const createVisit = (url: string = document.location.href): string =>
//   `cy.visit('${url}');`

let visitCommand = `cy.visit('${
  typeof window === 'undefined' ? ' ' : document.location.pathname
}');`
const events: ParsedEvent[] = []

const handleEvent = async (event: Event) => {
  // if (
  //   event.type === 'click' &&
  //   event.target &&
  //   // @ts-ignore
  //   event.target.nodeName !== 'BODY'
  // ) {
  //   // console.log('name:', computeAccessibleName(event.target as Element))
  // }
  // // @ts-ignore
  // if (event.type === 'click' && event.metaKey) {
  //   event.preventDefault()
  //   event.stopPropagation()
  // }

  const recorderPane = document.querySelector('[data-devtools="true"]')
  // @ts-ignore
  if (event.target && recorderPane?.contains(event.target)) return

  if (event.isTrusted === true) {
    const parsedEvent = await parseEvent(event)
    if (parsedEvent) {
      // if (parsedEvent.action == EventType.CLICK && !isClickable(event.target)) {
      //   return
      // }

      events.push(parsedEvent)
      // const codeBlock = createBlock(parsedEvent)
      // if (codeBlock) {
      //   console.log(createBlock(parsedEvent))
      // }
      render()
    }
  }
}

export const render = () => {
  // console.clear()
  // console.log(JSON.stringify(events, null, 2))
  const blocks: string[] = [visitCommand]
  events.forEach((event) => {
    const block = createBlock(event)
    if (block) {
      blocks.push(block)
    }
  })

  // console.log({ blocks })
  listeners.slice().forEach((listener) => listener(blocks))

  return blocks.join(`
`)
}

const createCodeLine = (sel: Selector, action?: string): string => {
  if (sel.parent) {
    const { parent, ...child } = sel
    return `${createCodeLine(parent)}.within(() => {
  ${createCodeLine(child, action)}
})`
  }

  switch (sel.method) {
    case 'findByLabelText':
    case 'findByPlaceholderText':
    case 'findByTestId':
    case 'findByText':
    case 'get':
      const command = `cy.${sel.method}('${sel.value}')`
      return action ? `${command}.${action}` : command
    default:
      throw new Error(`Unhandled method: ${sel.method}`)
  }
}

export const createBlock = (event: ParsedEvent): string | null => {
  // console.log({ event })
  switch (event.action) {
    case EventType.CLICK:
      return handleClick(event)
    case EventType.KEYDOWN:
      return handleKeydown(event)
    case EventType.CHANGE:
      return handleChange(event)
    case EventType.DBCLICK:
      return handleDoubleclick(event)
    case EventType.SUBMIT:
      return handleSubmit(event)
    default:
      throw new Error(`Unhandled event: ${event.action}`)
  }
}

function handleClick(event: ParsedEvent): string {
  return createCodeLine(event.selector, 'click()')
}

function handleKeydown(event: ParsedEvent): string | null {
  switch (event.key) {
    case 'Backspace':
      return createCodeLine(event.selector, `type('{backspace}')`)
    case 'Escape':
      return createCodeLine(event.selector, `type('{esc}')`)
    case 'ArrowUp':
      return createCodeLine(event.selector, `type('{uparrow}')`)
    case 'ArrowRight':
      return createCodeLine(event.selector, `type('{rightarrow}')`)
    case 'ArrowDown':
      return createCodeLine(event.selector, `type('{downarrow}')`)
    case 'ArrowLeft':
      return createCodeLine(event.selector, `type('{leftarrow}')`)
    default:
      return null
  }
}

const handleChange = (event: ParsedEvent): string | null => {
  if (event.inputType === 'checkbox' || event.inputType === 'radio') return null
  return createCodeLine(
    event.selector,
    `type('${event.value.replace(/'/g, "\\'")}')`
  )
}

const handleDoubleclick = (event: ParsedEvent): string => {
  return createCodeLine(event.selector, 'dblclick()')
}

const handleSubmit = (event: ParsedEvent): string => {
  return createCodeLine(event.selector, 'submit()')
}

let initialized = false

export function addDOMListeners(): void {
  if (initialized) return
  Object.values(EventType).forEach((event) => {
    document.addEventListener(event, handleEvent, {
      capture: true,
      passive: true,
    })
  })
  initialized = true
}

export function removeDOMListeners(): void {
  Object.values(EventType).forEach((event) => {
    document.removeEventListener(event, handleEvent, { capture: true })
  })
  initialized = false
}

export const subscribe = (listener: (blocks: string[]) => void) => {
  if (!initialized) {
    addDOMListeners()
  }
  listeners.push(listener)

  return function unsubscribe() {
    var index = listeners.indexOf(listener)
    listeners.splice(index, 1)
    if (listeners.length === 0) {
      removeDOMListeners()
    }
  }
}
