from algosdk import account, mnemonic, transaction
from algosdk.v2client import algod

# Set your API endpoint and your API key, as well as your private key/mnemonic    
algod_address = "https://testnet-algorand.api.purestake.io/ps2"
algod_token = "TgxWI5WBWNUlKgWik5j4ayezLDkb71J5VTw1mzd6"

# Create an algod client instance
algod_client = algod.AlgodClient(algod_token, algod_address)
# Add your private key/mnemonic here
private_key = mnemonic.to_private_key("route pair tourist fun warrior ready collect cloud nasty guess universe transfer agree vendor discover whisper fancy champion lunch black shoot canoe glow able feed")

# Get account address, verify balance
my_address = account.address_from_private_key(private_key)
# my_address = "G2XVAXJPP62LSDLC2PGFDFBKTT2A3JRXAAMPR4NDSEW3GKW6M6HS4HC7CA"
print("My address:", )

# Replace with the output addresses from the TEAL compilation

def read_teal_bytecode(file_path):
    with open(file_path, "rb") as f:
        return f.read()

approval_program_bytecode = read_teal_bytecode("staking_contract.teal")
clear_program_bytecode = read_teal_bytecode("clear.teal")

# Create the smart contract
params = algod_client.suggested_params()
txn = transaction.ApplicationCreateTxn(
    my_address,
    params,
    transaction.OnComplete.NoOpOC.real,
    approval_program_bytecode,
    clear_program_bytecode,
    global_schema=transaction.StateSchema(num_uints=2, num_byte_slices=0),
    local_schema=transaction.StateSchema(num_uints=4, num_byte_slices=0)
)

# Sign and send the transaction
signed_txn = txn.sign(private_key)
tx_id = signed_txn.transaction.get_txid()
algod_client.send_transactions([signed_txn])

# Wait for the transaction to be confirmed
# algod_client.wait_for_confirmation(tx_id)

# Get the created application ID
transaction_response = algod_client.pending_transaction_info(tx_id)
print(tx_id)
# app_id = transaction_response["application-index"]
# print(f"Application ID: {app_id}")
# PTTUJ6RGEFSVWTB267VLS246UOLQXUMIZNLPSVVC6IEJAMBSATYA
# W5WCLTMUPMKC6KJRWQQ6EM2HI6VQK5N4VJXWRVBASNLSNJ5QAU7Q