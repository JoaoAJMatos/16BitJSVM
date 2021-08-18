[-] What is a VM?

    To understand what a virtual machine is, we need to understand what the machine is in general.
    Simply put, it's a computer.

    Alan Turing devised a model of computation all the way back in 1936. His model consists of an
    infinit length of tape where you can draw symbols on. The tape is read by a machine one cell at a time.
    The machine comes with a table of instructions and some space to store the current state. 
    When the machine stops running it looks at it's current state, as well as the current cell of the tape
    and based on the instruction table it does one or more of the following:

        - Modifies the current symbol on the tape;
        - Moves the tape left or right entering a new state;
    
    This process is repeated until a special halting symbol is read and the halting state is entered.
    The Turing machine captures the very essence of computation. It is not the only model of computation that
    exists but it is the one that's closest to how our general purpose CPUs work.

    In the real world we obviosly can't have infinite lengths of tape, and the prospet of building something
    like this that is able to perform those functions sounds quite daunting.

    We can however build something which is very similar, equivalent in fact to a Turing machine; and that's
    the computer architecture we are more familiar with these days: the Von Neumann architecture.

    Instead of an infinit length of tape we have a finite amount of memory which is sequentially addressable.
    Instead of symbols on a tape, we have 1s and 0s which are able to be stored and loaded from memory.
    These form both our program and our data.

    The table of instructions and the current machine state are replaced by the CPU. 
    The CPU is a special piece of hardware that reads machine instructions from memory and modifies it's
    internal state based on the instruction stored on that memory cell. The CPU is also able of modyfing
    memory.

    All of this is built upon what's called Boolean Logic in digital circuits. We have so-called logic gates
    which take in one or more binary signals and produce a transformed output. For example, an AND gate 
    produces the result 1 if both numbers are a 1; if this condition doesn't apply, it produces a 0. An
    OR gate takes in 2 binary numbers as well but it produces a 1 if either of the numbers is a 1; and 0
    otherwise. A NOT gate takes in just one binary number and flips it to either a 1 to a 0 or a 0 to a 1.

    These three simple operations can be composed together to form more complex structures; for example,
    memory. But also circuits that can do arithmetic with numbers, or a circuit that can essentially encode
    making a choice based on it's inputs. 

    These more complex structures can then be put together in even more complex ways to form a machine
    that can sequentially fetch a value from a memory cell, decode it, make choices about which part of the
    structure will be activated next and finally to change the state and the memory as a result. The whole
    process repeats grabbing the next instruction from memory.

    CPUs are way more complex than that these days. But everything is fundamentally built on top of that
    foundation. 

    The real power of the CPU lies in the instructions that it has; what we can expressively tell it to do.
    The core instructions fall loosely into a few different categories: 

        - Moving data around;
        - Doing math and manipulation;
        - Jumping around to different parts of your program;
        - Making comparissons and decisions about how to proceed with a program;
        - Running sub processes and returning to previous states (Subroutines);

    In this project we will start out by setting up the two main parts of the VM. The memory and the CPU.
    