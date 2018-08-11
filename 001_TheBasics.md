
## The basics

This page is intended to be quick start tutorial. Assuming you already have some programming experience it should suffice to get you up and running


```python
# Code blocks in other languages generally use brackets like { & } to denote the start and end. 
# Python drops this method in favour of indentation. Thus misplaced indentation will throw an error
# consider
a=1
#  b=2 # BAD ... throws an indentation error
b=2    # Good .. no error thrown
```

Indentation becomes a much more important concept when writing a function, loop, class, or other construct which require proper indentation. Failure to do so will cause unexpected/unintended behaviour.

### Print Function (Basic version)
```python
print(<variable>)
```
Variable can be a string, or a number but you CANNOT concatenate one of each without an explicit conversion


```python
print('Hey Joe')
print(5)
#print(5 + 'Joe') #uncomment to see the Thrown error
print(str(5) +'-'+'Joes')
# Alternatively you use the formatted version of print 
# which acts similar to that found in C. We show this later on
```

    Hey Joe
    5
    5-Joes
    

### Variables, types, and assignment
Naming Rules
1. Names are case sensitive, and have an unlimited length
2. Must begin with a letter, underscore but can contain numbers (just not start with one)
3. You may not use a reserved keyword

Naming conventions 
1. avoid using an underscore as the first letter because this has a special significance to special functions. 
2. Basic variables should begin with a lowercase letter. Class variables should begin with a capital.

Implicit types
```python
pi = 3.14              #floating point
r = 3.                 #float
t = 1                  #integer (short)
t2=223372036854775808L
a = 1+2j    #Complex a.real=1, a.imag=2
k = 'hello' #string
l = "HELLO" #string you can also use 3double quotes ie: """hello"""
m = """hello3"""
```


```python
k = 'hello' 
l = "HELLO" 
m = """hello3"""
print(l)
print(k)
print(m)
```

    HELLO
    hello
    hello3
    


```python
# Assigning, determining, & deleting variables
num = 5 
mybool = True
num2,num3 = (11,22) #we'll explain tuples later on
x,y,z = "ABC"
print('Your variable is %s' % num)  #format as string
print('Your variable is %f' % num)  #Format as float
print('Var_1: %s  Var_2: %s'% (num2,num3))
print(x,y,z)   # pretty weird huh?

print(type(x))             # type(<var>) returns the variable type
print(type(mybool))        
print(type('abc') == str)  # Here we can see how to test for a type

print(id(x))     # this returns the variable's unique id
                 #NB if you assign a variable say y to a variable x then they'll have the same id
del num2         # deletes the variable from memory

#there are also some built in attributes unique to the math module
import math
getattr(math, 'pi')
# setattr(math, 'pi') = 3.14  #will set it, of course you really shouldn't do this
```

    Your variable is 5
    Your variable is 5.000000
    Var_1: 11  Var_2: 22
    A B C
    <class 'str'>
    <class 'bool'>
    True
    2208129895144
    




    3.141592653589793



### Operations 
1. Operating on mixed types with return the most complex input type
2. Explicit conversion should be used to clarify things. The following functions do that for you
int(),float(),complex(),long(),oct()-octadecimal,hex()-hexadecimal
***
**Mathematical Operations**

+, -, /, *, % =(addition, subtraction, division, Multiplication, Modulus)

** is unique to python its the exponential function or you can use pow() function

There are also augmented versions of the above

example (x += 1) is equivalent to (x = x + 1)
***
**Mathematical Functions**

abs(), max(), min(), round()
***
**Bitwise Operators**

~   = sign inversion(negation) ~10 = -10

'>>, <<  = right,left bit shift

|,^      = bitwise OR,XOR
***
NaN and inf may appear to indicate an error of an operation


```python
var2 = 1 + 3.9  #returns a float because it's more complex than an int
print(type(var2))
print(5/2)
x = 2
x **= 2
print(x)
```

    <class 'float'>
    2.5
    4
    
