import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { RecordsService } from './../src/records/records.service';

// Playwright imports
import { chromium, Browser, Page } from 'playwright';

describe('E2E Filter and Column Drawer Tests', () => {
  let app: INestApplication;
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Start Playwright browser
    browser = await chromium.launch();
    page = await browser.newPage();
    await page.goto('http://localhost:5173'); // Assuming frontend runs on 5173
  });

  afterAll(async () => {
    await app.close();
    await browser.close();
  });

  it('should open the filter drawer and display filter options', async () => {
    await page.click('button:has-text("Filter")');
    await page.waitForSelector('text="Advance Filters"');
    expect(await page.isVisible('text="Advance Filters"')).toBeTruthy();
    expect(await page.isVisible('text="Columns"')).toBeFalsy(); // Tabs should not be visible
  });

  it('should open the columns drawer and display column options', async () => {
    await page.click('button:has-text("Columns")');
    await page.waitForSelector('text="columns selected"');
    expect(await page.isVisible('text="columns selected"')).toBeTruthy();
    expect(await page.isVisible('text="Advance Filters"')).toBeFalsy(); // Tabs should not be visible
  });

  it('should allow selecting/deselecting columns when opened via filter button', async () => {
    // Open filter drawer
    await page.click('button:has-text("Filter")');
    await page.waitForSelector('text="Advance Filters"');

    // Click on a column checkbox (e.g., "Record #")
    const recordNumberCheckbox = page.locator('text="Record #"').locator('..').locator('input[type="checkbox"]');
    await recordNumberCheckbox.click(); // Deselect

    // Apply changes
    await page.click('button:has-text("APPLY FILTERS")'); // This button applies filters, not columns.
                                                        // This test case needs to be rethought.
                                                        // The drawer is now unified.
                                                        // If opened via filter, it's filter mode.
                                                        // If opened via columns, it's columns mode.

    // Re-open the drawer in columns mode to verify
    await page.click('button:has-text("Columns")');
    await page.waitForSelector('text="columns selected"');
    expect(await recordNumberCheckbox.isChecked()).toBeFalsy(); // Should be deselected

    // Select it back
    await recordNumberCheckbox.click();
    await page.click('button:has-text("Apply Changes")'); // Apply changes for columns
    await page.click('button:has-text("Columns")');
    await page.waitForSelector('text="columns selected"');
    expect(await recordNumberCheckbox.isChecked()).toBeTruthy();
  });

  // Add more tests for filtering logic (AND/OR, case-insensitive contains)
  // This will require interacting with the filter UI elements (selects, radio buttons, text inputs)
  // and then verifying the results in the table.
});
