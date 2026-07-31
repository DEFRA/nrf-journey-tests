async function attachScreenshot(world) {
  const screenshot = await world.page.screenshot({ fullPage: true })
  await world.attach(screenshot, 'image/png')
}

export { attachScreenshot }
