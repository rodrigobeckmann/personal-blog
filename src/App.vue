<script setup>
import { fetchPosts, createPost, adminLogin, verifyLogin, deletePost } from './services'
import {ref, onMounted, onBeforeMount} from 'vue'

const posts = ref([])
const title = ref('')
const content = ref('')
const logged = ref(false)



const handleSubmit = async (event) => {
  event.preventDefault()
  await createPost({ title: title.value, content: content.value })
  posts.value = await fetchPosts()
}

const handleLogin = async (event) => {
  event.preventDefault()
  const response = await adminLogin({ email: email.value, password: password.value })
  posts.value = await fetchPosts()
  if (response) {
    logged.value = true
  }
}

const logoff = async () => {
  const pastDate = new Date(0).toUTCString();
  document.cookie = 'token=; expires=' + pastDate + '; path=/;';
  logged.value = false
}

const handleDelete = async (id) => {
  await deletePost(id)
  posts.value = posts.value.filter(post => post.id !== id)
}

onBeforeMount(async () => {
 if (await verifyLogin()) {
   logged.value = true
 }
})

onMounted(async () => {
  posts.value = await fetchPosts()
})

</script>

<template>

  <form @submit="handleLogin">
    <label for="email">email</label>
    <input id="email" type="email">
    <br>
    <br>
    <br>
    <label for="password">password</label>
    <input id="password" type="password">
    <br>
    <br>
    <br>
    <button :disabled="logged" type="submit">Submit</button>
  </form>

  <button :disabled="!logged" @click="logoff">logoff</button>

  <br>
  <br>
  <br>

  <form @submit="handleSubmit" >
    <label for="title">Title</label>
    <input v-model="title" id="title" type="text">
    <br>
    <br>
    <br>
    <label for="content">Content</label>
    <textarea v-model="content" id="content"></textarea>
    <br>
    <br>
    <br>
    <button type="submit">Submit</button>
  </form>

<ul>
  <li v-for="post in posts" style="list-style: none;">
    <p class="text">Titulo: {{ post.title }}</p>
    <div class="blog-content">
      <p>{{ post.content }}</p>
    </div>
    <button @click="handleDelete(post.id)">x</button>
  </li>
</ul>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.text {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.blog-content {
  text-align: justify; /* Center-align the text */
  white-space: pre-wrap;
}

.blog-content p {
  font-size: 16px; /* Set the font size */
  line-height: 1.6; /* Set the line height */
  margin: 10px 0; /* Add some margin between paragraphs */
}

.blog-content br {
  margin-bottom: 20px;
}

</style>
