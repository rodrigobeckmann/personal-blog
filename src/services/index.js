import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null; // Cookie não encontrado
}



export const fetchPosts = async () => {
  const response = await axios.get(`${API_URL}/posts`);
  return response.data;
}

export const createPost = async (post) => {
  const token = getCookie('token');
  await axios.post(`${API_URL}/posts`, post, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const adminLogin = async (credentials) => {
  const token = await axios.post(`${API_URL}/login`, credentials);
  document.cookie = `token=${token.data.token}`;
  if (token.data.token) {
    return true;
  }
  return false;
}

export const verifyLogin = async () => {
  // const token = getCookie('token');
  // const user = await axios.get(`${API_URL}/login/verify`, {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // });
  // if (user.data) {
  //   return true;
  // }
  // return false;
  try {
    const token = getCookie('token');
    if (!token) {
      return false;
    }
    const user = await axios.get(`${API_URL}/login/verify`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
    return true;
  } catch {
    return false;
  }
}

export const deletePost = async (id) => {
  await axios.delete(`${API_URL}/posts/${id}`, {
    headers: {
      Authorization: `Bearer ${getCookie('token')}`,
    },
  });
}