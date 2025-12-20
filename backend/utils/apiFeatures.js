/**
 * API Features class for pagination, filtering, searching, and sorting
 */
class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  /**
   * Filter results based on query parameters
   */
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search', 'lang'];
    excludedFields.forEach(field => delete queryObj[field]);

    // Handle status filter
    if (queryObj.status) {
      queryObj.status = queryObj.status;
    }

    // Handle featured filter
    if (queryObj.featured) {
      queryObj.featured = queryObj.featured === 'true';
    }

    // Handle category filter
    if (queryObj.category) {
      queryObj.category = queryObj.category;
    }

    // Advanced filtering (gte, gt, lte, lt)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  /**
   * Search in title fields (Arabic and English)
   */
  search() {
    if (this.queryString.search) {
      const searchRegex = new RegExp(this.queryString.search, 'i');
      this.query = this.query.find({
        $or: [
          { title_en: searchRegex },
          { title_ar: searchRegex },
          { name_en: searchRegex },
          { name_ar: searchRegex },
        ],
      });
    }
    return this;
  }

  /**
   * Sort results
   */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  /**
   * Limit fields returned
   */
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  /**
   * Paginate results
   */
  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    this.pagination = { page, limit };
    return this;
  }
}

module.exports = ApiFeatures;
