# Please verify these reported errors:
## API calls:
- localhost:5000/api/peers?requestType=getPeersById&start=79&howMany=11
 * if start is somewhere between 79 and 89 it returns 10 elements in the array instead of the 11 asked
 * If you raise howMany and keep start in the 79-89 range it will always return less one item in the array than it should
