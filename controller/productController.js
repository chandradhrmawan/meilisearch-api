import fs from "fs";

import {
  createIndex,
  createDefaultIndexSettings,
  configureIndexSettings,
  meilisearchRequest,
  waitForTaskCompletion
} from '../helper/utils.js';
import {
  searchDocumentsService
} from "../services/productServices.js";

// Declare/Configure index endpoint
export const declareIndex = async (req, res, next) => {
  try {
    const baseIndexUid = 'product';
    const primaryKey = 'id';

    await createIndex(baseIndexUid, primaryKey);

    res.status(200).json({
      message: `Index '${baseIndexUid}' declared and configured successfully`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const reapplySettings = async (req, res, next) => {
  try {
    const indexSettings = createDefaultIndexSettings();
    await configureIndexSettings('product', indexSettings);
    res.status(200).json({
      message: `Index product declared and configured successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Seed data endpoint
export const seedData = async (req, res, next) => {
  try {
    const jsonlContent = fs.readFileSync('./dataset.jsonl', "utf-8");

    const dataset = jsonlContent
      .trim()
      .split("\n")
      .map((line) => {
        const obj = JSON.parse(line);
        return {
          id: obj.id,
          gender: obj.gender,
          masterCategory: obj.masterCategory,
          subCategory: obj.subCategory,
          articleType: obj.articleType,
          baseColour: obj.baseColour,
          season: obj.season,
          year: obj.year,
          usage: obj.usage,
          productDisplayName: obj.productDisplayName,
          variantName: obj.variantName,
          brandName: obj.brandName,
          price: obj.price,
          description: obj.description,
          imageUrl: obj.imageUrls.default,
        };
      });

    const addDocumentsResponse = await meilisearchRequest({
      endpoint: `/indexes/product/documents`,
      method: 'POST',
      data: dataset,
    });

    const taskResult = await waitForTaskCompletion(addDocumentsResponse.taskUid);
    if (!taskResult.success) {
      throw new Error(`Failed to create index: ${taskResult.error?.message || 'Unknown error'}`);
    }

    res.status(200).json({
      message: `Data seeded successfully to index '${indexUid}'`,
      indexUid: indexUid,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search documents endpoint
export const searchDocuments = async (req, res, next) => {
  try {
    const searchResults = await searchDocumentsService(req.body);
    res.status(200).json(searchResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
