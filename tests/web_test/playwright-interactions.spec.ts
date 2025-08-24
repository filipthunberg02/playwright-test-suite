import {test, expect} from "@playwright/test"

/**
 * Overall Usability Tests
 * -----------------------
 * A compact suite that verifies key interactions on the local test page:
 * - pointer hover behavior
 * - context menu handling
 * - double-click behavior (appends a badge)
 * - drag & drop
 * - native alert & confirm dialogs
 * - popup / new-window handling
 * - form validation and successful submission
 */

test.describe('Overall Usability Tests', ()=>{
    test.beforeEach(async ({page})=>{
        // Navigate to the local test page before each test.
        await page.goto('');
    });

    // Button Interactions: hover, right-click context menu, double-click badge insertion.
    test('Button Interactions', async ({page})=>{
        await page.hover('button#btn-hover');
        expect(await page.textContent('button#btn-hover')).toContain('Pointer Detected');
        
        await page.click('button#btn-ctx', {button: 'right'});
        expect(await page.getByText('Custom Option: Inspect').textContent()).toContain('Custom Option: Inspect');
        
        await page.dblclick('button#btn-dbl');
        expect(await page.getByText('Badge at').textContent()).toContain('Badge at');
    
    });

    // Drag and Drop: drag the card into the target and verify drop result, then reset.
    test('Drag and Drop', async ({page})=>{
        await page.dragAndDrop('#drag-card', '#drop-target');
        await expect(page.locator('#drop-target')).toContainText('Item: card');
        
        await page.click('button#reset-drop');
        await expect(page.locator('#drop-target')).not.toContainText('Item: card');
    
    });

    // Handling Alert: ensure native alert is received and message is correct.
    test('Handling Alert', async({page})=>{
        let alertMessage = '';
        page.on('dialog', async(dialog)=>{
            expect(dialog.type()).toBe('alert');
            alertMessage = await dialog.message();
            await dialog.accept();
        })
        await page.click('#native-alert');
        expect(alertMessage).toBe('This is a native alert from the test page.');
    });

    // Dismissing Confirm: dismiss the confirm and verify the page shows cancellation result.
    test('Dissmissing Alert', async({page})=>{
        let alertMessage = '';
        page.on('dialog', async(dialog)=>{
            alertMessage = await dialog.message();
            await dialog.dismiss();
        })
        await page.click('#native-confirm');
        expect(await page.getByText('User cancelled the confirmation.').textContent()).toContain('User cancelled the confirmation.');
    });

    // Handling POP-UPs: open a popup (child window) and validate content, then close it.
    test('Handling POP-UPs', async({page})=>{
        const [popup] = await Promise.all([
            page.waitForEvent('popup'),
            page.click('#open-child')
        ]);
    
        await popup.waitForLoadState();
        await popup.close();
    });

    // Open new window: clicking the navigation button opens a new tab/page in the context.
    test('Open new window', async ({ context, page })=>{
        const pagePromise = context.waitForEvent('page');
        await page.click('#open-new-page');
        const newPage = await pagePromise;
        await newPage.waitForLoadState();
        console.log(await newPage.title());
        await expect(newPage.getByRole('heading', {name: 'Example Child Page'})).toBeVisible();
    });

    // Handling Form: validate empty submission, invalid email, and successful registration.
    test('Handling Form', async({page})=>{
        await page.click('button#submit-reg');
        await page.fill('#first_name', 'John');
        await expect(page.getByText('Please fill all fields before registering.')).toContainText('Please fill all fields before registering.');
        
        await page.click('button#clear-reg');
        await page.fill('#first_name', 'John');
        await page.fill('#email_addr', 'Doe');
        await page.fill('#phone', '0701234567');
        await page.click('button#submit-reg');
        await expect(page.getByText('Please provide a valid email address.')).toContainText('Please provide a valid email address.');
    
        await page.click('button#clear-reg');
        await page.fill('#first_name', 'John Doe');
        await page.fill('#email_addr', 'john.doe@email.com');
        await page.fill('#phone', '0701234567');
    
        await page.click('button#submit-reg');
        await expect(page.getByText('Thanks John')).toContainText('Thanks John');
    });
});