# Meilisearch Example Project

A Node.js REST API example demonstrating integration with Meilisearch, an open-source search engine. This project provides product search functionality with filtering, sorting, and pagination capabilities.

## 📋 Features

- **Product Search**: Full-text search with Meilisearch
- **Advanced Filtering**: Filter by gender, category, color, brand, price range, etc.
- **Sorting**: Multi-field sorting support
- **Pagination**: Efficient pagination for search results
- **Faceted Search**: Get facet distributions for filtering UI
- **Index Management**: Create and configure search indexes
- **Data Seeding**: Bulk import products from JSONL dataset
- **Health Checks**: Monitor API and Meilisearch status
- **Docker Support**: Easy deployment with Docker Compose

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Search Engine**: Meilisearch v1.10
- **HTTP Client**: Axios
- **Environment**: dotenv
- **Development**: Nodemon, ESLint

## 📦 Prerequisites

- Node.js (v14 or higher)
- Docker & Docker Compose
- npm or yarn

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd meilisearch-example
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000

# Meilisearch Configuration
MEILI_BASE_URL=http://localhost:7700
MEILI_MASTER_KEY=your_master_key_here
MEILI_ENV=development
MEILI_NO_ANALYTICS=true
MEILI_LOG_LEVEL=INFO
MEILISEARCH_PORT=7700
```

### 4. Start Meilisearch with Docker

```bash
docker-compose up -d
```

This will start Meilisearch on `http://localhost:7700`

### 5. Run the Application

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The API will be available at `http://localhost:3000`

## 📚 API Endpoints

### Health Check

- **GET** `/health` - Check API and Meilisearch health status

### Product Management

- **POST** `/api/products/declare-index` - Create and configure product index
- **POST** `/api/products/reapply-settings` - Reapply index settings
- **POST** `/api/products/seed` - Seed product data from dataset.jsonl

### Search

- **POST** `/api/products/search` - Search products with filters

#### Search Request Body Example:

```json
{
  "keyword": "shirt",
  "page": 1,
  "hitsPerPage": 20,
  "sort": ["price:asc"],
  "filter": ["gender = Men", "masterCategory = Apparel"],
  "priceRange": {
    "min": 0,
    "max": 5000
  },
  "facets": ["gender", "masterCategory", "baseColour", "brandName"]
}
```

#### Search Response Example:

```json
{
  "hits": [...],
  "estimatedTotalHits": 150,
  "page": 1,
  "hitsPerPage": 20,
  "totalPages": 8,
  "processingTimeMs": 12,
  "facetDistribution": {
    "gender": { "Men": 100, "Women": 50 },
    "baseColour": { "Blue": 30, "Black": 25 }
  }
}
```

## 🗂️ Project Structure

```
meilisearch-example/
├── app.js                  # Express app configuration
├── server.js               # Server entry point
├── package.json            # Dependencies and scripts
├── docker-compose.yml      # Docker configuration
├── dataset.jsonl           # Product dataset
├── eslint.config.js        # ESLint configuration
├── rest.http               # HTTP request examples
├── controller/
│   ├── healthController.js # Health check logic
│   └── productController.js# Product operations
├── routes/
│   ├── healthRoutes.js     # Health routes
│   └── productRoutes.js    # Product routes
└── helper/
    ├── axios.js            # Axios configuration
    └── utils.js            # Utility functions
```

## 🔧 Available Scripts

```bash
# Start production server
npm start

# Start development server with auto-reload
npm run dev

# Run ESLint
npm run lint
```

## 🐳 Docker Commands

```bash
# Start Meilisearch container
docker-compose up -d

# Stop Meilisearch container
docker-compose down

# View logs
docker-compose logs -f meilisearch

# Remove volumes (delete data)
docker-compose down -v
```

## 📝 Setting Up the Search Index

After starting the application, initialize the search index:

1. **Declare the index:**
   ```bash
   curl -X POST http://localhost:3000/api/products/declare-index
   ```

2. **Seed the data:**
   ```bash
   curl -X POST http://localhost:3000/api/products/seed
   ```

3. **Start searching:**
   ```bash
   curl -X POST http://localhost:3000/api/products/search \
     -H "Content-Type: application/json" \
     -d '{"keyword": "shirt", "page": 1, "hitsPerPage": 10}'
   ```

## 🔍 Search Features

### Filtering
Filter products by multiple attributes:
- `gender` (Men, Women, Boys, Girls, Unisex)
- `masterCategory` (Apparel, Accessories, Footwear)
- `subCategory`, `articleType`, `baseColour`
- `brandName`, `season`, `year`, `usage`
- Price range (min/max)

### Sorting
Sort by multiple fields:
- `price:asc` / `price:desc`
- `year:asc` / `year:desc`
- `_rankingScore:desc` (relevance)

### Facets
Get distribution counts for:
- Gender, Category, Color, Brand
- Use for building filter UIs

## 🌐 Accessing Meilisearch Dashboard

Meilisearch provides a built-in dashboard:

```
http://localhost:7700
```

Use your `MEILI_MASTER_KEY` to authenticate.

## 🔐 Security Notes

- Change the default `MEILI_MASTER_KEY` in production
- Use HTTPS in production environments
- Consider setting `MEILI_ENV=production` for production
- Implement authentication for your API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

ISC

## 🙏 Acknowledgments

- [Meilisearch](https://www.meilisearch.com/) - Lightning Fast Search Engine
- [Express.js](https://expressjs.com/) - Web Framework
- Fashion dataset for demonstration purposes

## 📞 Support

For issues and questions, please open an issue on the GitHub repository.

---

**Happy Searching! 🔍**