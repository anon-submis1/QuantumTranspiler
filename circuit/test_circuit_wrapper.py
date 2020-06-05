from pytket.qasm import circuit_from_qasm, circuit_to_qasm
from pytket.pyquil import pyquil_to_tk
from pyquil import Program, get_qc
from pyquil.gates import H, CNOT, CCNOT
from circuit.qiskit_utility import show_figure
from qiskit import QuantumCircuit
from qiskit.tools.visualization import dag_drawer
from qiskit.aqua.algorithms import Shor
from pyquil.gates import *
import numpy as np
from circuit.circuit_wrapper import CircuitWrapper
from pyquil.quilbase import Declare, Gate, Halt, Measurement, Pragma, DefGate
from examples.example_circuits import ExampleCircuits

class TestCircuitWrapper:
    def test_pyquil_import(self):
        wrapper = CircuitWrapper(pyquil_program=ExampleCircuits.pyquil_custom())
        show_figure(wrapper.circuit)

    def test_pyquil_export(self):
        wrapper = CircuitWrapper(qiskit_circuit=ExampleCircuits.qiskit_custom())
        pyquil = wrapper.export_pyquil()
        print(pyquil)


if __name__ == "__main__":
    test = TestCircuitWrapper()
    test.test_pyquil_import()
