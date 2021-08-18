const createMemory = require('./create-memory');
const instructions = require('./instructions');

class CPU {
    constructor(memory) {
        this.memory = memory;

        // REGISTER ARRAY
        /*
        Registers are tiny bits of memory built directly into a CPU and are the primary holders of state.
        We have special registers for example the instruction pointer (IP) that holds the memory address of the
        next instrucion. We also have general purpose registers which the programmer can use when they're
        performing calculations on values.

        Since registers are just small bits of memory, we can use the memory function we wrote to create them.
        */

       this.registerNames = [
        "ip", "acc", 
        "r1", "r2", "r3", "r4",
        "r5", "r6", "r7", "r8",
       ]

       /*
       Since we are doing a 16-bit CPU, it makes sense that each register is 16 bits wide. That means we need
       2 bytes for every register. So we can create memory that has a length of register names multiplied by
       2 since we have to specify memory size in bytes.
       */

       this.registers = createMemory(this.registerNames.length * 2);

       /*
       In order to go from the register name which is a string
       to the actual value in our memory, I'm going to create another property called register map.
       This property maps the name to a byte offset.

       We can use reduce() on the register names taking a map, the register name and then the index.
       The initial value of the map will be an empty object. Each value will add a key to the map
       which is the register name, and the value will be the index multiplied by 2.

       Now we have a way to get from a name to a place inside the register memory
       */

       this.registerMap = this.registerNames.reduce((map, name, i) => {
        map[name] = i * 2;
        return map;
       }, {});
    }

    // DEBUG
    /*
    The debug method let's us take a peek inside the registers.

    It loops through the register names and prints the name and the value that we find in hexadecimal
    */
   debug() {
       this.registerNames.forEach(name => {
           console.log(`${name}: 0x${this.getRegister(name).toString(16).padStart(4, "0")}`);
       });
       console.log();
   }

    /*
    Let's now add some convinience methods for getting and setting values in the registers.

    For getting a register, we need to check if that register name actually exists in our map, if it does
    we can return the 16 bit value we find at that memory location.

    Setting a register is pretty much the same. We check if the register exists (throw an error otherwise),
    and set the value inside.
    */

    // Get Register Value
    getRegister(name) {
        if (!(name in this.registerMap)) {
            throw new Error(`getRegister: No such register '${name}'`);
        }

        return this.registers.getUint16(this.registerMap[name]);
    }

    // Set Register
    setRegister(name, value) {
        if (!(name in this.registerMap)) {
            throw new Error(`setRegister: No such register '${name}'`);
        }  

        return this.registers.setUint16(this.registerMap[name], value);
    }

    // FETCH
    /*
    To fetch a new instruction in memory, what we need to do is go to the instruction that's being pointed by
    the IP register. To do this, we can use the convinience methods we wrote above to get the address in the IP
    register. Then we can get the actual instruction at that address. Finally, we can add 1 to the instruction
    pointer and return the instruction.

    Every time we call fetch, we get the instruction and automatically move the IP by one byte.
    */
    fetch() {
        const nextInstructionAddress = this.getRegister("ip");
        const instruction = this.memory.getUint8(nextInstructionAddress);
        this.setRegister("ip", nextInstructionAddress + 1);
        return instruction;
    }

    fetch16() {
        const nextInstructionAddress = this.getRegister("ip");
        const instruction = this.memory.getUint16(nextInstructionAddress);
        this.setRegister("ip", nextInstructionAddress + 2);
        return instruction;
    }

    // EXECUTE
    /* 
    The execute function is going to take an instruction as an argument. Inside it, we can perform all
    the different checks of the different instructions that we will define.
    */
   execute(instruction) {
       switch (instruction) {
            // Move literal vlue into r1 register
            case instructions.MOV_LIT_R1: {
                /*
                After identifying the instruction as being a MOVE LIT TO R1, the next step is to get the
                literal value. For this, we can get the next two bytes in memory which are actually currently
                being pointed to by the IP. To do this, we could call the fetch() method two times, but instead,
                we are going to write another method that specifically fetches a 16 bit number, called fetch16().
                */
                const literal = this.fetch16();
                this.setRegister("r1", literal);
                return;
            }

            // Move literal vlue into r2 register
            case instructions.MOV_LIT_R2: {
                const literal = this.fetch16();
                this.setRegister("r2", literal);
                return;
            }

            // Add register to register
            case instructions.ADD_REG_REG: {
                /*
                ADD refers to two register values which are only 1 byte long. Having said that we can just use
                fetch to get each of those. 

                Now we need to take this numeric value that we have recieved for the register and transalte it
                to an actual register. The simplest way that we can do this for now is to just say that the
                value that we got for the instruction corresponds to the index that we originally specified in
                the register names. Therefore, the accumulator would be 0, the instruction pointer would be 1,
                r1 would be 2 and so on. We can get those values directly from the register memory; we just need
                to multiply those by two; since of course we are pointing to a byte and each register takes up two
                bytes.

                Finally, we just need to set the accumulator register to the sum of those two values.
                */
                const r1 = this.fetch()
                const r2 = this.fetch()
                const registerValue1 = this.registers.getUint16(r1 * 2);
                const registerValue2 = this.registers.getUint16(r2 * 2);
                this.setRegister("acc", registerValue1 + registerValue2);
                return;
            }
       }
   }

   // STEP
   /*
   The step method will bring all of our methods together. It's going to first fetch the instruction
   and then it will call execute on it.
   */
   step() {
       const instruction = this.fetch();
       return this.execute(instruction);
   }
}

module.exports = CPU;