/* 
Before going any further, we need to think about the kind of code that this VM is going to run.
It'll be a very simple set of instructions which we will eventually represent with a whole assembly
language. We might right a program in some imagined assembly language that looks something like this:

                                mov 0x1234, r1
                                mov 0xABCD, r2
                                add r1, r2

That's a pretty straightforward program. First, we move the hex value 1234 into the r1 register; then we
move the hex value ABCD into the r2 register; finnaly we add r1 and r2 together.

The logical question to ask is what does that translate into for our VM since it needs to be some kind of 
numerical representation in memory.

Well, let's look at the first instruction:

                                mov 0x1234, r1

We need a numerical way to say that this is a move instruction. We can arbitrarily say that a move instruction
is indicated by the byte 0x10. Then the value 0x1234 will come next in memory, but let's think about that being
two separate bytes; therefore it will be transalted to 0x12 0x34. Finally, we can represent r1 as 0x01.

Transating the assembly instruction:

                             0x10 0x12 0x13 0x01

Following that same logic we can translate the second instruction (mov 0xABCD, r2):

                             0x10 0xAB 0xCD 0x02

For the ADD instruction, we can assign the value 0x11 to be instruction value and index the two registers
in the same way we did before. Transating the add instruction:

                               0x11 0x01 0x02

This is going to work fine, but in a VM and any sort of low-level system both the amount of memory our programs
use and the amount of time each instruction takes to process are both valuable resources. Having said that,
we can make something different for the MOVE instruction, for example; instead of saying that 0x10 is a general
MOVE instruction, we can say that 0x10 is a MOVE instruction to specifically move a literal value into the r1
register. Now, 0x10 is paired directly with the r1 register. That would save us one byte every time we need to
perform that kind of operation. That also means that the VM wouldn't have to do as much checking as it might
have to before because it doesn't need to work out which register these values need to go to. 

Translating the first MOVE instruction using the new MOVE LIT VALUE TO R1 method:

                               0x10 0x12 0x34

------------------------------------------------------------------------------------------------------------------

Notice that we've got a trade-off here. There are only 255 1 byte instructions and we have already specified
10 registers; and there will be more. So that would be 10 gone right away, which is almost 4% of the total
instruction set that we could express here. 

If it's an operation that's likely to be used very often, then it can make sense to save space and time,
but if it's used less often or the possibility space is just to high, then it might be better to use a longer
instruction and sacrifice the memory.

------------------------------------------------------------------------------------------------------------------

Now let's think about how our CPU processes these instructions. CPUs work in a cicle; they first fetch an 
instruction; then they decode it, figuring out what they really need to do; and finally they execute that
instruction. 

For this VM, the decode and the execute steps will blend together, since in software we only need to use
some IF statements or a SWITCH statement to check which instruction we have, we don't need to emulate complex
circuitry. So, we will have a method for fetch and a method for execute (These methods can be found in the
CPU.js file)
*/

// Instruction Set
const MOV_LIT_R1  = 0x10;
const MOV_LIT_R2  = 0x11;
const ADD_REG_REG = 0x12;

module.exports = {
    MOV_LIT_R1,
    MOV_LIT_R2,
    ADD_REG_REG
}