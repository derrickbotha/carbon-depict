/**
 * State Normalization Utilities - Phase 3 Week 11: Frontend State Management
 *
 * Utilities for normalizing and denormalizing state:
 * - Convert arrays to normalized objects (by ID)
 * - Maintain relationships between entities
 * - Efficient updates and lookups
 * - Reduce data duplication
 */

/**
 * Normalize an array of entities by their ID
 *
 * @param {Array} entities - Array of entities to normalize
 * @param {string} idKey - Key to use as identifier (default: '_id')
 * @returns {Object} Normalized state with entities and allIds
 *
 * @example
 * const emissions = [{ _id: '1', value: 100 }, { _id: '2', value: 200 }]
 * normalize(emissions)
 * // Returns:
 * // {
 * //   entities: { '1': { _id: '1', value: 100 }, '2': { _id: '2', value: 200 } },
 * //   allIds: ['1', '2']
 * // }
 */
export const normalize = (entities, idKey = '_id') => {
  if (!Array.isArray(entities)) {
    return { entities: {}, allIds: [] }
  }

  const normalized = {
    entities: {},
    allIds: []
  }

  entities.forEach(entity => {
    const id = entity[idKey]
    if (id) {
      normalized.entities[id] = entity
      normalized.allIds.push(id)
    }
  })

  return normalized
}

/**
 * Denormalize entities back to an array
 *
 * @param {Object} normalized - Normalized state
 * @returns {Array} Array of entities
 */
export const denormalize = (normalized) => {
  if (!normalized || !normalized.entities || !normalized.allIds) {
    return []
  }

  return normalized.allIds
    .map(id => normalized.entities[id])
    .filter(Boolean) // Filter out any undefined entities
}

/**
 * Add entity to normalized state
 *
 * @param {Object} normalized - Current normalized state
 * @param {Object} entity - Entity to add
 * @param {string} idKey - ID key
 * @param {boolean} prepend - Add to beginning of allIds
 * @returns {Object} New normalized state
 */
export const addEntity = (normalized, entity, idKey = '_id', prepend = true) => {
  const id = entity[idKey]

  if (!id) {
    return normalized
  }

  // Don't add if it already exists
  if (normalized.entities[id]) {
    return updateEntity(normalized, id, entity)
  }

  return {
    entities: {
      ...normalized.entities,
      [id]: entity
    },
    allIds: prepend
      ? [id, ...normalized.allIds]
      : [...normalized.allIds, id]
  }
}

/**
 * Update entity in normalized state
 *
 * @param {Object} normalized - Current normalized state
 * @param {string} id - Entity ID
 * @param {Object} updates - Updates to apply
 * @returns {Object} New normalized state
 */
export const updateEntity = (normalized, id, updates) => {
  if (!normalized.entities[id]) {
    return normalized
  }

  return {
    ...normalized,
    entities: {
      ...normalized.entities,
      [id]: {
        ...normalized.entities[id],
        ...updates
      }
    }
  }
}

/**
 * Remove entity from normalized state
 *
 * @param {Object} normalized - Current normalized state
 * @param {string} id - Entity ID
 * @returns {Object} New normalized state
 */
export const removeEntity = (normalized, id) => {
  if (!normalized.entities[id]) {
    return normalized
  }

  const { [id]: removed, ...remainingEntities } = normalized.entities

  return {
    entities: remainingEntities,
    allIds: normalized.allIds.filter(entityId => entityId !== id)
  }
}

/**
 * Merge new entities into normalized state
 *
 * @param {Object} normalized - Current normalized state
 * @param {Array} newEntities - New entities to merge
 * @param {string} idKey - ID key
 * @returns {Object} New normalized state
 */
export const mergeEntities = (normalized, newEntities, idKey = '_id') => {
  const newNormalized = normalize(newEntities, idKey)

  // Merge entities
  const mergedEntities = {
    ...normalized.entities,
    ...newNormalized.entities
  }

  // Combine allIds, removing duplicates
  const allIdsSet = new Set([...normalized.allIds, ...newNormalized.allIds])
  const mergedAllIds = Array.from(allIdsSet)

  return {
    entities: mergedEntities,
    allIds: mergedAllIds
  }
}

/**
 * Get entity by ID from normalized state
 *
 * @param {Object} normalized - Normalized state
 * @param {string} id - Entity ID
 * @returns {Object|null} Entity or null
 */
export const getEntity = (normalized, id) => {
  return normalized.entities[id] || null
}

/**
 * Get multiple entities by IDs
 *
 * @param {Object} normalized - Normalized state
 * @param {Array} ids - Array of entity IDs
 * @returns {Array} Array of entities
 */
export const getEntities = (normalized, ids) => {
  return ids
    .map(id => normalized.entities[id])
    .filter(Boolean)
}

/**
 * Filter entities by predicate
 *
 * @param {Object} normalized - Normalized state
 * @param {Function} predicate - Filter function
 * @returns {Array} Filtered entities
 */
export const filterEntities = (normalized, predicate) => {
  return normalized.allIds
    .map(id => normalized.entities[id])
    .filter(predicate)
}

/**
 * Sort entities by comparator
 *
 * @param {Object} normalized - Normalized state
 * @param {Function} comparator - Sort function
 * @returns {Array} Sorted entities
 */
export const sortEntities = (normalized, comparator) => {
  return denormalize(normalized).sort(comparator)
}

/**
 * Group entities by a key
 *
 * @param {Object} normalized - Normalized state
 * @param {string} groupKey - Key to group by
 * @returns {Object} Grouped entities
 */
export const groupEntities = (normalized, groupKey) => {
  const entities = denormalize(normalized)
  return entities.reduce((groups, entity) => {
    const key = entity[groupKey]
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(entity)
    return groups
  }, {})
}

/**
 * Create empty normalized state
 *
 * @returns {Object} Empty normalized state
 */
export const createEmptyNormalizedState = () => ({
  entities: {},
  allIds: []
})

/**
 * Check if normalized state is empty
 *
 * @param {Object} normalized - Normalized state
 * @returns {boolean} True if empty
 */
export const isNormalizedStateEmpty = (normalized) => {
  return !normalized || normalized.allIds.length === 0
}

/**
 * Get count of entities in normalized state
 *
 * @param {Object} normalized - Normalized state
 * @returns {number} Count of entities
 */
export const getEntityCount = (normalized) => {
  return normalized ? normalized.allIds.length : 0
}

/**
 * Create index for fast lookups by a specific field
 *
 * @param {Object} normalized - Normalized state
 * @param {string} indexKey - Key to index by
 * @returns {Object} Index mapping field values to entity IDs
 *
 * @example
 * const normalized = {
 *   entities: {
 *     '1': { _id: '1', type: 'fuel', value: 100 },
 *     '2': { _id: '2', type: 'electricity', value: 200 }
 *   },
 *   allIds: ['1', '2']
 * }
 * createIndex(normalized, 'type')
 * // Returns: { fuel: ['1'], electricity: ['2'] }
 */
export const createIndex = (normalized, indexKey) => {
  const index = {}

  normalized.allIds.forEach(id => {
    const entity = normalized.entities[id]
    const value = entity[indexKey]

    if (value !== undefined) {
      if (!index[value]) {
        index[value] = []
      }
      index[value].push(id)
    }
  })

  return index
}

/**
 * Apply optimistic update to normalized state
 *
 * @param {Object} normalized - Current normalized state
 * @param {string} id - Entity ID
 * @param {Object} updates - Optimistic updates
 * @param {string} tempIdKey - Key to mark as temporary update
 * @returns {Object} New normalized state with optimistic update
 */
export const applyOptimisticUpdate = (normalized, id, updates, tempIdKey = '__optimistic') => {
  return updateEntity(normalized, id, {
    ...updates,
    [tempIdKey]: true
  })
}

/**
 * Revert optimistic update
 *
 * @param {Object} normalized - Current normalized state
 * @param {string} id - Entity ID
 * @param {Object} originalEntity - Original entity before optimistic update
 * @returns {Object} New normalized state with optimistic update reverted
 */
export const revertOptimisticUpdate = (normalized, id, originalEntity) => {
  return updateEntity(normalized, id, originalEntity)
}

/**
 * Confirm optimistic update (remove temporary marker)
 *
 * @param {Object} normalized - Current normalized state
 * @param {string} id - Entity ID
 * @param {Object} confirmedData - Confirmed data from server
 * @param {string} tempIdKey - Temporary marker key
 * @returns {Object} New normalized state with confirmed data
 */
export const confirmOptimisticUpdate = (normalized, id, confirmedData, tempIdKey = '__optimistic') => {
  const { [tempIdKey]: removed, ...cleanData } = confirmedData
  return updateEntity(normalized, id, cleanData)
}

export default {
  normalize,
  denormalize,
  addEntity,
  updateEntity,
  removeEntity,
  mergeEntities,
  getEntity,
  getEntities,
  filterEntities,
  sortEntities,
  groupEntities,
  createEmptyNormalizedState,
  isNormalizedStateEmpty,
  getEntityCount,
  createIndex,
  applyOptimisticUpdate,
  revertOptimisticUpdate,
  confirmOptimisticUpdate
}
