import dotenv from 'dotenv';
dotenv.config();


import instance from './axios.js';

// import axios from 'axios';

// Meilisearch configuration
const MEILI_BASE_URL = process.env.MEILI_BASE_URL || 'http://localhost:7700';
const MEILI_MASTER_KEY = process.env.MEILI_MASTER_KEY || 'aSampleMasterKey';

// Helper function to make API requests to Meilisearch
export const meilisearchRequest = async ({
  endpoint,
  data,
  params,
  method = 'GET',
  contentType = 'application/json',
}) => {
  const url = `${MEILI_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': contentType,
    'Authorization': `Bearer ${MEILI_MASTER_KEY}`,
  };

  const config = {
    method,
    url,
    headers,
  };

  if (data) {
    config.data = contentType === 'application/x-ndjson' ?
      data :
      JSON.stringify(data);
  }

  if (params) {
    config.params = params;
  }

  try {
    const request = await instance(config);
    return request.data;
  } catch (err) {
    throw err;
  }

};

export const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * charactersLength))).join('');
}

export const waitForTaskCompletion = async (taskUid, maxRetries = 30, retryInterval = 1000) => {
  let retries = 0;

  while (retries < maxRetries) {
    const taskResponse = await meilisearchRequest({ endpoint: `/tasks/${taskUid}`, method: 'GET' });

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
export const createDefaultIndexSettings = (customSettings = {}) => {
  const defaultSettings = {
    searchableAttributes: [
      'gender',
      'masterCategory',
      'subCategory',
      'articleType',
      'baseColour',
      'season',
      'year',
      'usage',
      'productDisplayName',
      'variantName',
      'brandName',
      'price',
      'description'
    ],
    filterableAttributes: [
      'gender',
      'masterCategory',
      'subCategory',
      'articleType',
      'baseColour',
      'season',
      'year',
      'usage',
      'productDisplayName',
      'variantName',
      'brandName',
      'price',
      'description'
    ],
    sortableAttributes: [
      'gender',
      'masterCategory',
      'subCategory',
      'articleType',
      'baseColour',
      'season',
      'year',
      'usage',
      'productDisplayName',
      'variantName',
      'brandName',
      'price',
      'description',
      '_rankingScore'
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
    ],
    pagination: {
      maxTotalHits: 100000
    }
  };

  return { ...defaultSettings, ...customSettings };
};

// Index creation service (Single Responsibility)
export const createIndex = async (indexUid, primaryKey) => {
  const createResponse = await meilisearchRequest({
    endpoint: '/indexes',
    method: 'POST',
    data: {
      uid: indexUid,
      primaryKey: primaryKey
    }
  });

  const taskResult = await waitForTaskCompletion(createResponse.taskUid);

  if (!taskResult.success) {
    throw new Error(`Failed to create index: ${taskResult.error?.message || 'Unknown error'}`);
  }

  return taskResult.task;
};

// Index settings configuration service (Single Responsibility)
export const configureIndexSettings = async (indexUid, settings) => {
  const data = {
    endpoint: `/indexes/${indexUid}/settings`,
    data: settings,
    method: 'PATCH',
  };

  console.log(data);

  const settingsResponse = await meilisearchRequest(data);

  const taskResult = await waitForTaskCompletion(settingsResponse.taskUid);

  if (!taskResult.success) {
    throw new Error(`Failed to configure index settings: ${taskResult.error?.message || 'Unknown error'}`);
  }

  return taskResult.task;
};
