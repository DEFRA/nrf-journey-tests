import { Page } from './page.js'

class PlanningTypePage extends Page {
  open() {
    return super.open('/quote/planning-type')
  }

  async selectPlanningType(type) {
    await this.page.getByRole('radio', { name: type }).click()
  }
}

export { PlanningTypePage }
