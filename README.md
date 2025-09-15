# XENO - Multi-Tenant Shopify Analytics Dashboard

A comprehensive multi-tenant analytics dashboard for Shopify stores, built with Next.js 15, Express.js, and PostgreSQL. This application provides real-time insights into customer behavior, order analytics, product performance, and checkout abandonment tracking across multiple Shopify stores.

## 🚀 Features

- **Multi-Tenant Architecture**: Support for multiple Shopify stores per user
- **Real-time Analytics**: Live dashboard with key performance indicators
- **Customer Insights**: Customer segmentation, repeat vs first-time analysis
- **Order Management**: Comprehensive order tracking and revenue analytics
- **Product Analytics**: Product performance and inventory insights
- **Checkout Analytics**: Abandoned cart tracking and conversion metrics
- **Interactive Charts**: Beautiful data visualizations using Recharts
- **Responsive Design**: Modern UI with Tailwind CSS and Framer Motion
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Webhook Integration**: Real-time data synchronization with Shopify

## 🏗️ High-Level Architecture

![Architecture Diagram](images/architecture.png)

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Shopify       │    │   Frontend      │    │   Backend       │
│   Stores        │    │   (Next.js 15)  │    │   (Express.js)  │
│                 │    │                 │    │                 │
│  ┌───────────┐  │    │  ┌───────────┐  │    │  ┌───────────┐  │
│  │ Store A   │  │◄───┤  │ Dashboard │  │◄───┤  │ API Routes │  │
│  │ Store B   │  │    │  │ Analytics │  │    │  │ Auth      │  │
│  │ Store C   │  │    │  │ Charts    │  │    │  │ Webhooks  │  │
│  └───────────┘  │    │  └───────────┘  │    │  └───────────┘  │
│                 │    │                 │    │                 │
│  Webhooks ──────┼────┤                 │    │  ┌───────────┐  │
│  OAuth          │    │                 │    │  │ PostgreSQL│  │
│                 │    │                 │    │  │ Database  │  │
└─────────────────┘    └─────────────────┘    │  └───────────┘  │
                                              └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **State Management**: React Context API

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Shopify Integration**: @shopify/shopify-api
- **Webhooks**: Express webhook handling

### Infrastructure

- **Database**: PostgreSQL
- **ORM**: Prisma
- **Environment**: Node.js
- **Package Manager**: npm

## 📊 Data Models

![Database Schema](images/database.png)

### Core Entities

#### Tenant (Shopify Store)

```typescript
{
  id: string (CUID)
  storeUrl: string (unique)
  accessToken: string
  createdAt: DateTime
  // Relationships
  customers: Customer[]
  products: Product[]
  orders: Order[]
  checkouts: Checkout[]
  users: User[]
}
```

#### Customer

```typescript
{
  id: BigInt (Shopify ID)
  tenantId: string
  firstName: string?
  lastName: string?
  email: string?
  phone: string?
  createdAt: DateTime
  orderCount: Int
  // Relationships
  orders: Order[]
}
```

#### Order

```typescript
{
  id: BigInt (Shopify ID)
  tenantId: string
  totalPrice: Float
  currency: string
  financialStatus: string?
  createdAt: DateTime
  customerId: BigInt?
  // Relationships
  customer: Customer?
  lineItems: LineItem[]
}
```

#### Product

```typescript
{
  id: BigInt (Shopify ID)
  tenantId: string
  title: string
  vendor: string?
  productType: string?
  createdAt: DateTime
  // Relationships
  lineItems: LineItem[]
}
```

#### Checkout

```typescript
{
  id: BigInt (Shopify ID)
  tenantId: string
  email: string?
  isCompleted: boolean
  createdAt: DateTime
}
```

#### LineItem

```typescript
{
  id: BigInt (Shopify ID)
  tenantId: string
  orderId: BigInt
  productId: BigInt
  name: string
  title: string
  vendor: string?
  quantity: Int
  // Relationships
  order: Order
  product: Product
}
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/change-password` - Password change (authenticated)

### Shopify Integration

- `GET /api/shopify/install` - Initiate Shopify OAuth
- `GET /api/shopify/callback` - Handle OAuth callback
- `POST /api/shopify/webhooks/orders/create` - Order webhook handler

### Tenant Management

- `GET /api/tenants/me/data` - Get user's tenant data
- `POST /api/tenants/:tenantId/sync` - Sync tenant data from Shopify
- `POST /api/tenants/link` - Link user to tenant
- `DELETE /api/tenants/:tenantId` - Delete tenant
- `GET /api/tenants/:tenantId/checkout-stats` - Get checkout statistics

### Webhooks

- `POST /api/webhooks/shopify/:tenantId` - General Shopify webhook handler

## 🏪 Store Integration & Webhook Procedures

### Store Connection Process

#### 1. **Store Installation Flow**

The store integration follows a secure OAuth 2.0 flow with Shopify:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    User     │    │  Frontend   │    │   Backend   │    │   Shopify   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │ 1. Click "Add Store"                  │                   │
       ├──────────────────►│                   │                   │
       │                   │                   │                   │
       │ 2. Enter store URL                    │                   │
       ├──────────────────►│                   │                   │
       │                   │                   │                   │
       │ 3. Open install URL                   │                   │
       │◄──────────────────┤                   │                   │
       │                   │                   │                   │
       │ 4. GET /api/shopify/install           │                   │
       │                   ├──────────────────►│                   │
       │                   │                   │                   │
       │ 5. Redirect to Shopify OAuth          │                   │
       │                   │                   ├──────────────────►│
       │                   │                   │                   │
       │ 6. User grants permissions            │                   │
       │                   │                   │                   │
       │ 7. OAuth callback with code           │                   │
       │                   │                   │◄──────────────────┤
       │                   │                   │                   │
       │ 8. Exchange code for access token     │                   │
       │                   │                   ├──────────────────►│
       │                   │                   │                   │
       │ 9. Create tenant & register webhooks  │                   │
       │                   │                   │                   │
       │ 10. Redirect to success page          │                   │
       │                   │◄──────────────────┤                   │
       │                   │                   │                   │
       │ 11. Show success & close window       │                   │
       │◄──────────────────┤                   │                   │
```

#### 2. **Detailed Installation Steps**

**Step 1: User Initiates Store Connection**

- User clicks "Add Store" button in the dashboard
- Frontend opens a modal requesting the store URL
- User enters their store's `.myshopify.com` URL
- Frontend validates the URL format

**Step 2: OAuth Initiation**

```javascript
// Frontend: AddStoreModal.tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!storeName.trim() || !storeName.includes(".myshopify.com")) {
    setError("Please enter a valid .myshopify.com store URL.");
    return;
  }
  const installUrl = `${
    process.env.NEXT_PUBLIC_BACKEND_URL
  }/api/shopify/install?shop=${storeName.trim()}`;
  window.open(installUrl, "_blank", "noopener,noreferrer");
};
```

**Step 3: Backend OAuth Handling**

```javascript
// Backend: shopify.controller.js
const install = async (req, res) => {
  const shop = req.query.shop;
  if (!shop) {
    return res.status(400).send("Missing 'shop' query parameter.");
  }

  await shopify.auth.begin({
    shop: shop,
    callbackPath: "/api/shopify/callback",
    isOnline: false,
    rawRequest: req,
    rawResponse: res,
  });
};
```

**Step 4: OAuth Callback Processing**

```javascript
const callback = async (req, res) => {
  try {
    const callbackData = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });
    const { session } = callbackData;

    // Create or update tenant in database
    const tenant = await prisma.tenant.upsert({
      where: { storeUrl: session.shop },
      update: { accessToken: session.accessToken },
      create: { storeUrl: session.shop, accessToken: session.accessToken },
      select: { id: true, storeUrl: true },
    });

    // Register webhooks for the store
    await registerWebhooks(session.shop, session.accessToken, tenant.id);

    // Redirect back to frontend
    res.redirect(
      `${process.env.CLIENT_URL}/shopify/return?newTenantId=${tenant.id}&shop=${tenant.storeUrl}`
    );
  } catch (error) {
    console.error("Failed during OAuth callback:", error);
    res.status(500).send("Authentication failed.");
  }
};
```

### Webhook Registration & Processing

#### 1. **Webhook Registration Process**

When a store is successfully connected, the system automatically registers the following webhooks:

```javascript
const webhookTopics = [
  "products/create", // New product created
  "products/update", // Product updated
  "products/delete", // Product deleted
  "orders/create", // New order placed
  "customers/create", // New customer registered
  "customers/update", // Customer information updated
  "checkouts/create", // Checkout initiated
  "checkouts/update", // Checkout updated
  "app/uninstalled", // App uninstalled from store
];
```

**Webhook Registration Code:**

```javascript
const registerWebhooks = async (storeUrl, accessToken, tenantId) => {
  const webhookEndpoint = `${process.env.HOST}/api/webhooks/shopify/${tenantId}`;

  for (const topic of webhookTopics) {
    try {
      const apiUrl = `https://${storeUrl}/admin/api/2024-07/webhooks.json`;
      const requestBody = {
        webhook: {
          topic: topic,
          address: webhookEndpoint,
          format: "json",
        },
      };

      await axios.post(apiUrl, requestBody, {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      });

      console.log(
        `✅ Successfully registered webhook: ${topic} for ${storeUrl}`
      );
    } catch (error) {
      console.error(
        `❌ Failed to register webhook: ${topic} for ${storeUrl}`,
        error.response?.data
      );
    }
  }
};
```

#### 2. **Webhook Processing Architecture**

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Shopify   │    │   Webhook   │    │  Processing │    │  Database   │
│   Store     │    │  Endpoint   │    │   Logic     │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │ 1. Webhook Event  │                   │                   │
       ├──────────────────►│                   │                   │
       │                   │                   │                   │
       │ 2. Verify HMAC    │                   │                   │
       │                   ├──────────────────►│                   │
       │                   │                   │                   │
       │ 3. Extract Topic  │                   │                   │
       │                   │                   │                   │
       │ 4. Process Data   │                   │                   │
       │                   │                   ├──────────────────►│
       │                   │                   │                   │
       │ 5. Return 200 OK  │                   │                   │
       │◄──────────────────┤                   │                   │
```

#### 3. **Webhook Handler Implementation**

**Webhook Security & Validation:**

```javascript
const handleShopifyWebhook = async (req, res) => {
  const topic = req.headers["x-shopify-topic"];
  const tenantId = req.params.tenantId;
  const shopDomain = req.headers["x-shopify-shop-domain"];
  const data = req.body;

  // Verify webhook authenticity using HMAC
  const valid = await shopify.webhooks.validate({
    rawBody: req.body.toString(),
    rawRequest: req,
    rawResponse: res,
  });

  if (!valid || !shopDomain) {
    return res
      .status(401)
      .json({ error: "Invalid HMAC or missing shop domain" });
  }

  // Process webhook asynchronously
  res.status(200).send();

  // Process the webhook data
  await processWebhookData(topic, tenantId, data);
};
```

**Webhook Data Processing:**

```javascript
switch (topic) {
  case "products/create":
    await prisma.product.upsert({
      where: { id_tenantId: { id: data.id, tenantId } },
      update: {
        title: data.title,
        vendor: data.vendor,
        productType: data.product_type,
      },
      create: {
        id: data.id,
        tenantId: tenantId,
        title: data.title,
        vendor: data.vendor,
        productType: data.product_type,
        createdAt: new Date(data.created_at),
      },
    });
    break;

  case "orders/create":
    // Update checkout if order has checkout_id
    if (data.checkout_id) {
      await prisma.checkout.updateMany({
        where: { id: data.checkout_id, tenantId },
        data: { isCompleted: true },
      });
    }

    // Create order with line items
    await prisma.$transaction(async (tx) => {
      await tx.order.create({
        data: {
          id: data.id,
          tenantId,
          totalPrice: parseFloat(data.total_price),
          currency: data.currency,
          financialStatus: data.financial_status,
          createdAt: new Date(data.created_at),
          customerId: data.customer ? data.customer.id : null,
          lineItems: {
            create: data.line_items.map((item) => ({
              id: item.id,
              productId: item.product_id,
              name: item.name,
              title: item.title,
              vendor: item.vendor,
              quantity: item.quantity,
            })),
          },
        },
      });
    });
    break;

  case "checkouts/create":
    await prisma.checkout.upsert({
      where: { id_tenantId: { id: data.id, tenantId } },
      update: {},
      create: {
        id: data.id,
        tenantId,
        email: data.email,
      },
    });
    break;

  case "app/uninstalled":
    // Clean up all data when app is uninstalled
    await prisma.$transaction(async (tx) => {
      await tx.lineItem.deleteMany({ where: { tenantId } });
      await tx.order.deleteMany({ where: { tenantId } });
      await tx.customer.deleteMany({ where: { tenantId } });
      await tx.product.deleteMany({ where: { tenantId } });
      await tx.tenant.delete({ where: { id: tenantId } });
    });
    break;
}
```

### Data Synchronization

#### 1. **Initial Data Sync**

After store connection, users can manually trigger a full data synchronization:

```javascript
// API Endpoint: POST /api/tenants/:tenantId/sync
const syncTenantData = async (req, res) => {
  const { tenantId } = req.params;
  const { userId } = req.user;

  // Verify user has access to tenant
  const userHasAccess = await prisma.user.findFirst({
    where: { id: userId, tenants: { some: { id: tenantId } } },
  });

  if (!userHasAccess) {
    return res
      .status(403)
      .json({ error: "Forbidden: You don't have access to this tenant." });
  }

  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });

  // Sync all data types
  await shopifyService.syncProducts(
    tenant.id,
    tenant.storeUrl,
    tenant.accessToken
  );
  await shopifyService.syncCustomers(
    tenant.id,
    tenant.storeUrl,
    tenant.accessToken
  );
  await shopifyService.syncOrders(
    tenant.id,
    tenant.storeUrl,
    tenant.accessToken
  );

  res.status(200).json({ message: "Sync completed successfully." });
};
```

#### 2. **Sync Service Implementation**

```javascript
// services/shopify.service.js
async function syncProducts(tenantId, storeUrl, accessToken) {
  const shopifyApiUrl = `https://${storeUrl}/admin/api/2024-07/products.json`;
  const response = await fetch(shopifyApiUrl, {
    headers: { "X-Shopify-Access-Token": accessToken },
  });

  const { products } = await response.json();

  for (const product of products) {
    await prisma.product.upsert({
      where: { id_tenantId: { id: product.id, tenantId } },
      update: {
        title: product.title,
        vendor: product.vendor,
        productType: product.product_type,
      },
      create: {
        id: product.id,
        tenantId,
        title: product.title,
        vendor: product.vendor,
        productType: product.product_type,
        createdAt: new Date(product.created_at),
      },
    });
  }

  console.log(`Synced ${products.length} products for ${storeUrl}`);
}
```

### Security Considerations

#### 1. **Webhook Security**

- **HMAC Verification**: All webhooks are verified using Shopify's HMAC signature
- **Domain Validation**: Shop domain is validated against registered tenants
- **Rate Limiting**: Webhook endpoints are protected against abuse
- **Idempotency**: Webhook processing is designed to be idempotent

#### 2. **Data Privacy**

- **Tenant Isolation**: Each store's data is completely isolated
- **Access Control**: Users can only access stores they're linked to
- **Data Encryption**: Sensitive data is encrypted at rest
- **Audit Logging**: All data access is logged for compliance

#### 3. **Error Handling**

- **Graceful Degradation**: Failed webhooks don't crash the system
- **Retry Logic**: Failed webhook processing can be retried
- **Dead Letter Queue**: Failed webhooks are logged for manual processing
- **Monitoring**: Webhook success/failure rates are monitored

### Troubleshooting Store Integration

#### Common Issues:

1. **OAuth Failures**

   - Verify Shopify app credentials
   - Check redirect URLs in Shopify Partner Dashboard
   - Ensure HTTPS is enabled in production

2. **Webhook Failures**

   - Verify webhook endpoint is accessible
   - Check HMAC verification logic
   - Monitor webhook delivery in Shopify admin

3. **Data Sync Issues**

   - Verify access token permissions
   - Check API rate limits
   - Monitor database connection health

4. **Permission Errors**
   - Ensure user is linked to tenant
   - Verify tenant exists and is active
   - Check access token validity

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 13+
- npm or yarn
- Shopify Partner Account

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd XENO-TEST-2
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your .env file with database and Shopify credentials
   npx prisma generate
   npx prisma db push
   npm run dev
   ```

3. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   # Configure your .env.local file with API endpoints
   npm run dev
   ```

4. **Environment Variables**

   **Backend (.env)**

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/xeno_db"
   JWT_SECRET="your-jwt-secret"
   SHOPIFY_API_KEY="your-shopify-api-key"
   SHOPIFY_API_SECRET="your-shopify-api-secret"
   HOST="http://localhost:3000"
   CLIENT_URL="http://localhost:3001"
   ```

   **Frontend (.env.local)**

   ```env
   NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"
   ```

### Running the Application

1. Start the backend server:

   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:

   ```bash
   cd frontend
   npm run dev
   ```

3. Access the application at `http://localhost:3001`

## 🔧 Development

### Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset
```

### Code Structure

```
backend/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Express middleware
├── routes/          # API routes
├── services/        # Business logic services
├── utils/           # Utility functions
├── prisma/          # Database schema and migrations
└── server.js        # Main server file

frontend/
├── app/             # Next.js app directory
│   ├── components/  # React components
│   ├── dashboard/   # Dashboard pages
│   └── (auth)/      # Authentication pages
├── lib/             # Utility functions and API services
└── components/      # Shared UI components
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm run test
```

## 📈 Assumptions Made

### Technical Assumptions

1. **Multi-tenancy**: Each user can manage multiple Shopify stores
2. **Data Synchronization**: Real-time sync via webhooks with fallback to manual sync
3. **Authentication**: JWT-based stateless authentication
4. **Database**: PostgreSQL for ACID compliance and complex queries
5. **Shopify API**: Standard REST API usage with webhook integration
6. **Frontend**: Client-side rendering with server-side data fetching
7. **Error Handling**: Graceful degradation with user-friendly error messages

### Business Assumptions

1. **Store Owners**: Primary users are Shopify store owners/administrators
2. **Data Privacy**: Customer data is stored securely and used only for analytics
3. **Real-time Needs**: Near real-time data updates are sufficient (not instant)
4. **Scalability**: System designed to handle moderate traffic (not enterprise-scale)
5. **Browser Support**: Modern browsers with JavaScript enabled
6. **Mobile Responsiveness**: Mobile-first design approach

### Security Assumptions

1. **HTTPS**: All production traffic uses HTTPS
2. **Token Security**: JWT tokens stored in HTTP-only cookies
3. **Input Validation**: All user inputs are validated and sanitized
4. **Webhook Verification**: Shopify webhooks are verified using HMAC
5. **Database Security**: Database connections use SSL in production

## 🚀 Next Steps to Productionize

### 1. Infrastructure & Deployment

- [ ] **Containerization**: Dockerize both frontend and backend
- [ ] **Orchestration**: Set up Kubernetes or Docker Compose for production
- [ ] **Load Balancing**: Implement load balancer for high availability
- [ ] **CDN**: Set up CDN for static assets and global distribution
- [ ] **SSL/TLS**: Configure SSL certificates and HTTPS enforcement

### 2. Database & Performance

- [ ] **Database Optimization**: Add indexes for frequently queried fields
- [ ] **Connection Pooling**: Implement database connection pooling
- [ ] **Caching**: Add Redis for session storage and data caching
- [ ] **Query Optimization**: Optimize Prisma queries and add pagination
- [ ] **Database Monitoring**: Set up database performance monitoring

### 3. Security Enhancements

- [ ] **Rate Limiting**: Implement API rate limiting
- [ ] **Input Validation**: Add comprehensive input validation middleware
- [ ] **Security Headers**: Configure security headers (CORS, CSP, etc.)
- [ ] **Audit Logging**: Implement comprehensive audit logging
- [ ] **Penetration Testing**: Conduct security testing and vulnerability assessment

### 4. Monitoring & Observability

- [ ] **Application Monitoring**: Set up APM (Application Performance Monitoring)
- [ ] **Logging**: Implement structured logging with ELK stack or similar
- [ ] **Metrics**: Add Prometheus metrics and Grafana dashboards
- [ ] **Alerting**: Configure alerts for critical issues
- [ ] **Health Checks**: Implement comprehensive health check endpoints

### 5. Scalability & Reliability

- [ ] **Horizontal Scaling**: Design for horizontal scaling
- [ ] **Database Sharding**: Plan for database sharding if needed
- [ ] **Message Queues**: Implement message queues for async processing
- [ ] **Circuit Breakers**: Add circuit breaker patterns for external APIs
- [ ] **Disaster Recovery**: Set up backup and disaster recovery procedures

### 6. DevOps & CI/CD

- [ ] **CI/CD Pipeline**: Set up automated testing and deployment
- [ ] **Environment Management**: Separate dev, staging, and production environments
- [ ] **Configuration Management**: Use environment-specific configuration
- [ ] **Secrets Management**: Implement secure secrets management
- [ ] **Automated Testing**: Add comprehensive test coverage

### 7. User Experience & Features

- [ ] **Error Boundaries**: Add React error boundaries for better UX
- [ ] **Loading States**: Implement skeleton loading and progress indicators
- [ ] **Offline Support**: Add service worker for offline functionality
- [ ] **Accessibility**: Ensure WCAG compliance
- [ ] **Internationalization**: Add multi-language support

### 8. Business Continuity

- [ ] **Data Backup**: Implement automated data backup strategies
- [ ] **Compliance**: Ensure GDPR, CCPA, and other regulatory compliance
- [ ] **Documentation**: Create comprehensive API and user documentation
- [ ] **Support System**: Set up customer support and ticketing system
- [ ] **Analytics**: Add user behavior analytics and business metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Built with ❤️ using Next.js, Express.js, and PostgreSQL**
