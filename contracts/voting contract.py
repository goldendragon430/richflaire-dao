# from pyteal import *

# # Constants
# voting_start_round = Int(1000)
# voting_end_round = Int(2000)
# yes_vote = Bytes("yes")
# no_vote = Bytes("no")

# # Voting smart contract logic
# def voting_smart_contract():

#     # Check if the transaction is an ApplicationCall transaction
#     on_application_call = Gtxn[0].type_enum() == TxnType.ApplicationCall

#     # Check if the vote is either "yes" or "no"
#     valid_vote = Or(
#         Gtxn[0].application_args[0] == yes_vote,
#         Gtxn[0].application_args[0] == no_vote
#     )

#     # Check if the transaction is within the voting period
#     within_voting_period = And(
#         Global.round() >= voting_start_round,
#         Global.round() <= voting_end_round
#     )

#     # Combine all the conditions
#     voting_conditions = And(on_application_call, valid_vote, within_voting_period)

#     return voting_conditions

# from pyteal import *
# from algosdk.v2client import algod
# from algosdk import encoding
# from algosdk import mnemonic

# # Define global state variables
# num_votes = Global.latest("num_votes")
# candidates = Global.latest("candidates")
# voters = Global.latest("voters")
#  # Define the contract logic
# approval_program = Cond(
#     [Txn.application_id() == Int(0), # This checks if the application ID is zero for app creation
#      Seq(
#          # Only the app creator can add candidates or voters
#          Assert(Txn.sender() == App.globalGet(Bytes("creator"))), # This checks if the sender is the app creator
#          # Add candidate
#          If(Txn.application_args[0] == Bytes("add_candidate"), # This checks if the first application argument is "add_candidate"
#             Seq(
#                 # Add the candidate to the global state variable "candidates"
#                 App.globalPut(Bytes("candidates"), Txn.application_args[1]),
#                 # Initialize the number of votes for this candidate to zero by updating the global state variable "num_votes"
#                 App.globalPut(Bytes("num_votes"), Int(0))
#             ),
#             # Add voter
#             If(Txn.application_args[0] == Bytes("add_voter"), # This checks if the first application argument is "add_voter"
#                 # Add the voter to the local state variable "voters"
#                 App.globalPut(Bytes("voters"), keccak256(Txn.application_args[1]), voters),
#                 # voters[Keccak256(Txn.application_args[1])] = Int(1)
#                 # Vote
#                 If(Txn.application_args[0] == Bytes("vote"), # This checks if the first application argument is "vote"
#                     Seq(
#                         # Check if the sender is a valid voter by verifying if the Keccak256 hash of the sender is present in the "voters" local state variable
#                         Assert(voters[Keccak256(Txn.sender())] == Int(1)),
#                         # Increment the number of votes for this candidate by updating the global state variable "num_votes"
#                         App.globalPut(Bytes("num_votes"), App.globalGet(Bytes("num_votes"))+Int(1)),
#                         # num_votes.value += Int(1),
#                         App.globalPut(Bytes("num_votes"), num_votes),
#                     )
#                 )
#             )
#         )
#      )],
#      # Read-only application call to retrieve the number of votes
#      [App.localGetEx(Int(0), Bytes("questions"), Bytes("num_votes")), App.globalGet(Bytes("num_votes"))],
#      # Read-only application call to retrieve the candidate list
#      [App.localGetEx(Int(0), Bytes("questions"), Bytes("candidates")), App.globalGet(Bytes("candidates"))]
# )

# Compile the smart contract
# if __name__ == "__main__":
#     compiled_teal = compileTeal(approval_program, mode=Mode.Application, version=3)
#     print(compiled_teal)
#     with open("approval.teal", "w") as file:
#         # Append some content to the file
#         file.write(compiled_teal)

    # The file will be automatically closed after the 'with' block

from pyteal import *

# Constants
voting_start_round = Int(1)
voting_end_round = Int(100000)
number_of_candidates = Int(3)

# Global state
global_votes = [Bytes("candidate_{}".format(i)) for i in range(1, number_of_candidates.value + 1)]

# Voting smart contract
def voting_contract():
    on_creation = Seq([
        Assert(Txn.application_args.length() == Int(0)),
        *[App.globalPut(vote, Int(0)) for vote in global_votes],
        App.globalPut(Bytes("voting_start_round"), voting_start_round),
        App.globalPut(Bytes("voting_end_round"), voting_end_round),
        Return(Int(1))
    ])

    on_vote = Seq([
        Assert(Txn.application_args.length() == Int(1)),
        Assert(Global.round() >= App.globalGet(Bytes("voting_start_round"))),
        Assert(Global.round() <= App.globalGet(Bytes("voting_end_round"))),
        App.globalPut(Txn.application_args[0], App.globalGet(Txn.application_args[0]) + Int(1)),
        Return(Int(1))
    ])

    program = Cond(
        [Txn.application_id() == Int(0), on_creation],
        [Txn.on_completion() == OnComplete.NoOp, on_vote]
    )

    return program

if __name__ == "__main__":
    with open("voting.teal", "w") as f:
        compiled = compileTeal(voting_contract(), mode=Mode.Application, version=3)
        f.write(compiled)



