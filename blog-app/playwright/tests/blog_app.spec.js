const { test, expect, beforeEach, describe } = require('@playwright/test')
const { create } = require('node:domain')
const { after } = require('node:test')

const login = async ({ page }) => {
  await page.locator('input[name="username"]').fill("mluukkai")
  await page.locator('input[name="password"]').fill("salainen")
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByText('logged in as mluukkai').waitFor()
}

const createBlog = async ({ page }, title = "Test title") => {
  await page.getByRole('button', { name: 'add blog' }).click()
  await page.locator('#title').fill(title)
  await page.locator('#author').fill("Test author")
  await page.locator('#url').fill("www.example.com")
  await page.getByRole('button', { name: 'add blog' }).click()
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'log in' })).toBeVisible()
    await expect(page.locator('input[name="username"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await login({ page })
      await page.getByText('logged in as mluukkai').waitFor()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.locator('input[name="username"]').fill("mluukkai")
      await page.locator('input[name="password"]').fill("väärä salasana")
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByText('Wrong username or password').waitFor()
    })
  })

  describe('While logged in', () => {
    beforeEach(async ({ page }) => {
      await login({ page })
    })

    test('Add a blog', async ({ page }) => {
      await createBlog({ page }, 'Test title')
      await page.getByText(/Test title Test author/).waitFor()
    })

    test('Blog can be liked', async ({ page }) => {
      await createBlog({ page })
      await page.getByText(/Test title Test author/).waitFor()
      await page.getByRole('button', { name: 'show' }).click()
      await page.getByText(/likes: 0/).waitFor()
      await page.getByRole('button', { name: 'likes' }).click()
      await page.getByText(/likes: 1/).waitFor()
    })

    test('A blog can be removed', async ({ page }) => {
      page.on('dialog', dialog => dialog.accept());
      await createBlog({ page })
      await page.getByText(/Test title Test author/).waitFor()
      await page.getByRole('button', { name: 'show' }).click()
      await page.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByText(/Test title Test author/)).toBeHidden()
    })

    test('Only the adder can\' see the remove button', async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Testeri',
          username: 'tester',
          password: 'salainen'
        }
      })

      page.on('dialog', dialog => dialog.accept());
      await createBlog({ page })
      await page.getByRole('button', { name: 'show' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
      await page.getByRole('button', { name: 'logout' }).click()

      await page.locator('input[name="username"]').fill("tester")
      await page.locator('input[name="password"]').fill("salainen")
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByText('logged in as tester').waitFor()

      await page.getByRole('button', { name: 'show' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeHidden()
    })

    test('Blogs are in the correct order', async ({ page }) => {
      await createBlog({ page })
      await page.getByText(/Test title Test author/).waitFor()
      await page.getByRole('button', { name: 'show' }).click()
      await page.getByRole('button', { name: 'likes' }).click()
      await page.getByText(/likes: 1/).waitFor()
      await page.getByRole('button', { name: 'hide' }).click()

      await createBlog({ page }, "Popular blog")
      await page.getByText(/Popular blog Test author/).waitFor()
      await page.getByRole('button', { name: 'show' }).last().click()
      await page.getByRole('button', { name: 'hide' }).click()
      await page.getByRole('button', { name: 'show' }).last().click()
      await page.getByRole('button', { name: 'likes' }).click()
      await page.getByText(/likes: 1/).waitFor()
      await page.getByRole('button', { name: 'likes' }).click()
      await page.getByText(/likes: 2/).waitFor()
      await page.getByRole('button', { name: 'hide' }).click()
      await page.getByRole('button', { name: 'show' }).last().click()
      await page.getByText(/likes: 1/).waitFor()
    })
  })

})
