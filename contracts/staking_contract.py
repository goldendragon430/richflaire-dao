from pyteal import *

# Constants
min_stake_amt = Int(1000)  # Minimum amount of ALGOs required to stake
min_claim_amt = Int(1)
min_withdraw_amt = Int(10)
g_reward_amt = Bytes("g_reward_amt")
g_staked_amt = Bytes("g_staked_amt")
l_staked_amt = Bytes("l_staked_amt")
l_stake_time = Bytes("l_stake_time")
l_reward_amt = Bytes("l_reward_amt")
l_claim_amt = Bytes("l_claim_amt")

# Global get variables
g_staked_amt_get = App.globalGet(g_staked_amt)

# Local get variables
g_reward_amt_get = App.globalGet(g_reward_amt)
# g_deposit_round_get = App.globalGet(g_deposit_round)
l_staked_amt_get = App.localGet(Txn.sender(), l_staked_amt)
l_stake_time_get = App.localGet(Txn.sender(), l_stake_time)
l_reward_amt_get = App.localGet(Txn.sender(), l_reward_amt)
l_claim_amt_get = App.localGet(Txn.sender(), l_claim_amt)

# Check if the application is being created
on_creation = Seq([
    Assert(Txn.application_args.length() == Int(0)),
    App.globalPut(g_staked_amt, Int(1)),
    App.globalPut(g_reward_amt, Int(1)),
    # App.globalPut(g_deposit_round, Global.round()),
    Return(Int(1))
])

# Check if the user wants to stake ALGOs
on_stake = Seq([
    Assert(Txn.application_args[0] == Bytes("stake")),
    Assert(Btoi(Txn.application_args[1]) >= min_stake_amt),
    App.globalPut(g_staked_amt, g_staked_amt_get + Btoi(Txn.application_args[1])),
    App.localPut(Txn.sender(), l_staked_amt, l_staked_amt_get + Btoi(Txn.application_args[1])),
    App.localPut(Txn.sender(), l_stake_time, Btoi(Txn.application_args[2])),
    App.localPut(Txn.sender(), l_claim_amt, Int(0)),
    Return(Int(1))
])

# Define the logic for opt-in transactions
opt_in = Seq([
    Assert(Txn.type_enum() == TxnType.ApplicationCall),
    # Assert(Txn.application_id() == Int(0)),
    Return(Int(1))  # Return 1 (true) if the opt-in conditions are met
])
on_rewards = Seq([
    Assert(Txn.application_args[0] == Bytes("rewards")),
    App.localPut(Txn.sender(), l_reward_amt, Btoi(Txn.application_args[1])),
    Return(Int(1))
])

# Check if the user wants to claim rewards
on_claim_rewards = Seq([
    Assert(Txn.application_args[0] == Bytes("claim_rewards")),
    Assert(Btoi(Txn.application_args[1])>= min_claim_amt),
    InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields(
            {
                TxnField.type_enum: TxnType.Payment,
                TxnField.amount: Btoi(Txn.application_args[1]),
                TxnField.receiver: Txn.sender(),
                TxnField.sender:Txn.accounts[1],
            }
        ),
        InnerTxnBuilder.Submit(),
    App.globalPut(g_reward_amt, g_reward_amt_get+Btoi(Txn.application_args[1])),
    App.localPut(Txn.sender(), l_claim_amt, l_claim_amt_get+Btoi(Txn.application_args[1])),
    Return(Int(1))
])

# On withdraw
on_withdraw = Seq([
    Assert(Txn.application_args[0] == Bytes("withdraw")),
    # Assert(Txn.sender() == Txn.application_args[1]),
    Assert(Btoi(Txn.application_args[1]) > min_withdraw_amt),
    InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields(
            {
                TxnField.type_enum: TxnType.Payment,
                TxnField.amount: Btoi(Txn.application_args[1]),
                TxnField.receiver: Txn.sender(),
                TxnField.sender:Txn.accounts[1],
            }
        ),
        InnerTxnBuilder.Submit(),
    App.globalPut(g_staked_amt, g_staked_amt_get - Btoi(Txn.application_args[1])),
    App.localPut(Txn.sender(), l_staked_amt, l_staked_amt_get - Btoi(Txn.application_args[1])),
    Return(Int(1))
])

# Main program
program = Cond(
    [Txn.application_id() == Int(0), on_creation],
    [Txn.on_completion() == OnComplete.OptIn, Approve()],
    [And(Txn.on_completion() == OnComplete.NoOp, Txn.application_args[0] == Bytes("stake")), on_stake],
    [And(Txn.on_completion() == OnComplete.NoOp, Txn.application_args[0] == Bytes("rewards")), on_rewards],
    [And(Txn.on_completion() == OnComplete.NoOp, Txn.application_args[0] == Bytes("claim_rewards")), on_claim_rewards],
    [And(Txn.on_completion() == OnComplete.NoOp, Txn.application_args[0] == Bytes("withdraw")), on_withdraw]
)

if __name__ == "__main__":
    with open("staking_contract.teal", "w") as f:
        compiled = compileTeal(program, mode=Mode.Application, version=5)
        f.write(compiled)