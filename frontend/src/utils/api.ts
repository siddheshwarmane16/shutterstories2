const API_BASE_URL = 'http://localhost:5000/api';

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('shutter_token');
  }
  return null;
};

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('shutter_token', token);
  }
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('shutter_token');
    localStorage.removeItem('shutter_user');
  }
};

export const getAuthUser = (): any | null => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('shutter_user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const setAuthUser = (user: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('shutter_user', JSON.stringify(user));
  }
};

async function request(endpoint: string, method = 'GET', body: any = null) {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    console.error(`[API ERROR] ${method} ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  login: (credentials: any) => request('/auth/login', 'POST', credentials),
  register: (data: any) => request('/auth/register', 'POST', data),
  getMe: () => request('/auth/me', 'GET'),

  // Bookings
  createBooking: (bookingData: any) => request('/bookings', 'POST', bookingData),
  getBookings: () => request('/bookings', 'GET'),
  updateBooking: (id: string, status: string) => request(`/bookings/${id}`, 'PUT', { status }),

  // Portfolio
  getPortfolio: (category?: string, search?: string) => {
    let url = '/portfolio';
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    const query = params.toString();
    if (query) url += `?${query}`;
    return request(url, 'GET');
  },
  getCategories: () => request('/portfolio/categories', 'GET'),
  createPortfolioItem: (data: any) => request('/portfolio', 'POST', data),
  deletePortfolioItem: (id: string) => request(`/portfolio/${id}`, 'DELETE'),
  createCategory: (name: string) => request('/portfolio/categories', 'POST', { name }),

  // Blogs
  getBlogs: () => request('/blogs', 'GET'),
  getBlog: (id: string) => request(`/blogs/${id}`, 'GET'),
  createBlog: (data: any) => request('/blogs', 'POST', data),
  updateBlog: (id: string, data: any) => request(`/blogs/${id}`, 'PUT', data),
  deleteBlog: (id: string) => request(`/blogs/${id}`, 'DELETE'),

  // Testimonials
  getTestimonials: () => request('/testimonials', 'GET'),
  createTestimonial: (data: any) => request('/testimonials', 'POST', data),
  updateTestimonial: (id: string, data: any) => request(`/testimonials/${id}`, 'PUT', data),
  deleteTestimonial: (id: string) => request(`/testimonials/${id}`, 'DELETE'),

  // Packages
  getPackages: () => request('/packages', 'GET'),
  createPackage: (data: any) => request('/packages', 'POST', data),
  updatePackage: (id: string, data: any) => request(`/packages/${id}`, 'PUT', data),
  deletePackage: (id: string) => request(`/packages/${id}`, 'DELETE'),

  // Analytics
  getAnalytics: () => request('/analytics', 'GET'),
  logHit: (page: string) => request('/analytics/hit', 'POST', { page }),

  // Portal (Client & Admin)
  getClientProject: () => request('/portal/project', 'GET'),
  getClientInvoices: () => request('/portal/invoices', 'GET'),
  payInvoice: (id: string) => request(`/portal/invoices/${id}/pay`, 'POST'),
  getChatMessages: (partnerId?: string) => {
    let url = '/portal/chat';
    if (partnerId) url += `?partnerId=${partnerId}`;
    return request(url, 'GET');
  },
  sendMessage: (content: string, receiverId?: string) => request('/portal/chat', 'POST', { content, receiverId }),
  
  // Admin project status editor
  getAdminProjects: () => request('/portal/admin/projects', 'GET'),
  updateAdminProject: (id: string, data: any) => request(`/portal/admin/projects/${id}`, 'PUT', data),

  // File Upload
  uploadFile: (name: string, base64: string) => request('/upload', 'POST', { name, base64 }),
};
