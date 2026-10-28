async function request(path, options = {}) {
  const method = options.method || 'GET';
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (method !== 'GET' && window.skillverseCsrfToken) headers['X-CSRF-Token'] = window.skillverseCsrfToken;
  const response = await fetch(`/api${path}`, { credentials: 'same-origin', headers, ...options });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'No se pudo completar la solicitud.');
  if (payload.csrfToken) window.skillverseCsrfToken = payload.csrfToken;
  return payload;
}

export const api = {
  me: () => request('/auth/me'),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  courses: () => request('/courses'),
  courseLessons: (id) => request(`/courses/${id}/lessons`),
  lesson: (id) => request(`/lessons/${id}`),
  completeLesson: (id, score) => request(`/lessons/${id}/complete`, { method: 'POST', body: JSON.stringify({ score }) }),
  attempt: (id, answer) => request(`/exercises/${id}/attempt`, { method: 'POST', body: JSON.stringify({ answer }) }),
  stats: () => request('/stats'),
  progress: () => request('/progress'),
  achievements: () => request('/achievements'),
  leaderboard: () => request('/leaderboard'),
  profile: () => request('/profile'),
  updateProfile: (username) => request('/profile', { method: 'PATCH', body: JSON.stringify({ username }) }),
  adminCourses: () => request('/admin/courses'),
  createCourse: (data) => request('/admin/courses', { method: 'POST', body: JSON.stringify(data) })
};
