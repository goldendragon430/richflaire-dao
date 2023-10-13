from pyteal import *

def clear_state_program():
    return Return(Int(1))

if __name__ == "__main__":
     with open("clear.teal", "w") as f:
            compiled = compileTeal(clear_state_program(), Mode.Application, version = 5)
            f.write(compiled)
   