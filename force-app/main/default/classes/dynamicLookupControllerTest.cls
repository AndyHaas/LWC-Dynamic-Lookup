@isTest
public class dynamicLookupControllerTest {
    @isTest
    static void fetchAccounts() {
        Account a = new Account(Name = 'Test Account');
        insert a;
        Account a2 = new Account(Name = 'Test Account 2');
        insert a2;

        List<string> accts = new List<string>();

        Test.startTest();
        List<dynamicLookupController.SObjectResult> result1 = dynamicLookupController.getResults('Account', 'Name', '', null, null);
        accts.add(a.Id);
        List<dynamicLookupController.SObjectResult> result2 = dynamicLookupController.getResults('Account', 'Name', 'Test Account 2', accts, null);

        List<dynamicLookupController.SObjectResult> result2 = dynamicLookupController.getResults('Account', 'Name', 'Test Account 2', null, 'Name=Test Account 2');
        Test.stopTest();
    }
}
