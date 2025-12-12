import dotenv from 'dotenv';
dotenv.config();

// Meilisearch configuration
const MEILI_BASE_URL = process.env.MEILI_BASE_URL || 'http://localhost:7700';
const MEILI_MASTER_KEY = process.env.MEILI_MASTER_KEY || 'aSampleMasterKey';
// Helper function to make API requests to Meilisearch
const meilisearchRequest = async (endpoint, options = {}) => {
  const url = `${MEILI_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  // Add authorization header if master key is provided
  if (MEILI_MASTER_KEY) {
    headers['Authorization'] = `Bearer ${MEILI_MASTER_KEY}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Meilisearch API Error: ${error.message}`);
    throw error;
  }
};

const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * charactersLength))).join('');
}

const waitForTaskCompletion = async (taskUid, maxRetries = 30, retryInterval = 1000) => {
  let retries = 0;

  while (retries < maxRetries) {
    const taskResponse = await meilisearchRequest(`/tasks/${taskUid}`, { method: 'GET' });

    if (taskResponse.status === 'succeeded') {
      return { success: true, task: taskResponse };
    }

    if (taskResponse.status === 'failed') {
      return { success: false, task: taskResponse, error: taskResponse.error };
    }

    await new Promise(resolve => setTimeout(resolve, retryInterval));
    retries++;
  }

  throw new Error(`Task ${taskUid} did not complete within ${maxRetries} retries`);
};

// Default index settings factory (Open/Closed principle)
const createDefaultIndexSettings = (customSettings = {}) => {
  const defaultSettings = {
    searchableAttributes: [
      'name',
      'sub_category_name',
      'item_category_name',
      'category_name',
      'brand_name'
    ],
    filterableAttributes: [
      'name',
      'sub_category_name',
      'item_category_name',
      'category_name',
      'brand_name',
      'batch_id'
    ],
    sortableAttributes: [
      'name',
      'sub_category_name',
      'item_category_name',
      'category_name',
      'brand_name'
    ],
    displayedAttributes: ['*'],
    synonyms: {},
    stopWords: [],
    rankingRules: [
      'words',
      'typo',
      'proximity',
      'attribute',
      'sort',
      'exactness'
    ]
  };

  return { ...defaultSettings, ...customSettings };
};

// Index creation service (Single Responsibility)
const createIndex = async (indexUid, primaryKey) => {
  const createResponse = await meilisearchRequest('/indexes', {
    method: 'POST',
    body: JSON.stringify({
      uid: indexUid,
      primaryKey: primaryKey
    })
  });

  const taskResult = await waitForTaskCompletion(createResponse.taskUid);

  if (!taskResult.success) {
    throw new Error(`Failed to create index: ${taskResult.error?.message || 'Unknown error'}`);
  }

  return taskResult.task;
};

// Index settings configuration service (Single Responsibility)
const configureIndexSettings = async (indexUid, settings) => {
  const settingsResponse = await meilisearchRequest(`/indexes/${indexUid}/settings`, {
    method: 'PATCH',
    body: JSON.stringify(settings)
  });

  const taskResult = await waitForTaskCompletion(settingsResponse.taskUid);

  if (!taskResult.success) {
    throw new Error(`Failed to configure index settings: ${taskResult.error?.message || 'Unknown error'}`);
  }

  return taskResult.task;
};

export {
  createIndex,
  createDefaultIndexSettings,
  configureIndexSettings,
  generateRandomString,
  meilisearchRequest,
  waitForTaskCompletion
};