/**
 * Component Composition Utilities - Phase 3 Week 12: Component Architecture
 *
 * Utilities for composing components and eliminating prop drilling
 */
import { cloneElement, isValidElement, Children } from 'react'

/**
 * Compose multiple HOCs together
 *
 * @param {...Function} hocs - HOCs to compose
 * @returns {Function} Composed HOC
 *
 * @example
 * const enhance = compose(
 *   withLoadingState,
 *   withPerformance,
 *   withErrorBoundary
 * )
 * const EnhancedComponent = enhance(MyComponent)
 */
export const compose = (...hocs) => {
  return (Component) => {
    return hocs.reduceRight((acc, hoc) => hoc(acc), Component)
  }
}

/**
 * Create a compound component with shared context
 *
 * @param {Object} components - Object of sub-components
 * @param {Function} ParentComponent - Parent component
 * @returns {Component} Compound component
 *
 * @example
 * const Card = createCompoundComponent({
 *   Header: CardHeader,
 *   Body: CardBody,
 *   Footer: CardFooter
 * }, CardRoot)
 */
export const createCompoundComponent = (components, ParentComponent) => {
  Object.keys(components).forEach(key => {
    ParentComponent[key] = components[key]
  })

  return ParentComponent
}

/**
 * Clone element with additional props
 *
 * @param {ReactElement} element - Element to clone
 * @param {Object} props - Props to add
 * @returns {ReactElement} Cloned element
 */
export const cloneWithProps = (element, props) => {
  if (!isValidElement(element)) {
    return element
  }

  return cloneElement(element, props)
}

/**
 * Inject props into all children
 *
 * @param {ReactNode} children - Children to inject props into
 * @param {Object} props - Props to inject
 * @returns {Array} Children with injected props
 *
 * @example
 * const children = injectPropsIntoChildren(children, { theme: 'dark' })
 */
export const injectPropsIntoChildren = (children, props) => {
  return Children.map(children, child => {
    if (!isValidElement(child)) {
      return child
    }

    return cloneElement(child, props)
  })
}

/**
 * Filter children by type
 *
 * @param {ReactNode} children - Children to filter
 * @param {Component} type - Component type to filter by
 * @returns {Array} Filtered children
 *
 * @example
 * const headers = filterChildrenByType(children, CardHeader)
 */
export const filterChildrenByType = (children, type) => {
  return Children.toArray(children).filter(
    child => isValidElement(child) && child.type === type
  )
}

/**
 * Get children by type
 *
 * @param {ReactNode} children - Children to search
 * @param {Component} type - Component type to find
 * @returns {Array} Children of specified type
 */
export const getChildrenByType = (children, type) => {
  return filterChildrenByType(children, type)
}

/**
 * Create a render prop component
 *
 * @param {Function} renderFn - Function that returns component
 * @returns {Component} Render prop component
 *
 * @example
 * const MouseTracker = createRenderProp(({ render }) => {
 *   const [position, setPosition] = useState({ x: 0, y: 0 })
 *   return render(position)
 * })
 */
export const createRenderProp = (renderFn) => {
  return (props) => renderFn(props)
}

/**
 * Merge refs (useful for forwarding refs)
 *
 * @param {...React.Ref} refs - Refs to merge
 * @returns {Function} Merged ref callback
 */
export const mergeRefs = (...refs) => {
  return (value) => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(value)
      } else if (ref != null) {
        ref.current = value
      }
    })
  }
}

/**
 * Create a slot-based composition
 *
 * @param {Object} slots - Named slots
 * @param {ReactNode} children - Children to fill slots
 * @returns {Object} Filled slots
 *
 * @example
 * const { header, body, footer } = useSlots(
 *   { header: null, body: null, footer: null },
 *   children
 * )
 */
export const useSlots = (defaultSlots, children) => {
  const slots = { ...defaultSlots }

  Children.forEach(children, child => {
    if (isValidElement(child) && child.props.slot) {
      slots[child.props.slot] = child
    }
  })

  return slots
}

/**
 * Create a factory function for components
 *
 * @param {Component} Component - Component to create factory for
 * @param {Object} defaultProps - Default props
 * @returns {Function} Factory function
 *
 * @example
 * const createButton = componentFactory(Button, { variant: 'primary' })
 * const PrimaryButton = createButton({ size: 'lg' })
 */
export const componentFactory = (Component, defaultProps = {}) => {
  return (overrideProps = {}) => {
    return (props) => (
      <Component {...defaultProps} {...overrideProps} {...props} />
    )
  }
}

/**
 * Create polymorphic component (component that can render as different elements)
 *
 * @param {string} defaultElement - Default element type
 * @returns {Function} Polymorphic component creator
 *
 * @example
 * const Box = createPolymorphic('div')
 * <Box as="section">Content</Box>
 */
export const createPolymorphic = (defaultElement = 'div') => {
  return ({ as: Component = defaultElement, ...props }) => {
    return <Component {...props} />
  }
}

export default {
  compose,
  createCompoundComponent,
  cloneWithProps,
  injectPropsIntoChildren,
  filterChildrenByType,
  getChildrenByType,
  createRenderProp,
  mergeRefs,
  useSlots,
  componentFactory,
  createPolymorphic
}
