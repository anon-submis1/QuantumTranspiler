from pytket.qasm import circuit_from_qasm, circuit_to_qasm
from pytket.pyquil import pyquil_to_tk
from pyquil import Program, get_qc
from pyquil.gates import H, CNOT, CCNOT
from circuit.qiskit_utility import show_figure
from qiskit import QuantumCircuit
from qiskit.tools.visualization import dag_drawer
import numpy as np
from circuit.circuit_wrapper import CircuitWrapper
from pyquil.quilbase import Declare, Gate, Halt, Measurement, Pragma, DefGate
from examples.example_circuits import ExampleCircuits

class TestCircuitWrapper:
    def test_pyquil_import(self):
        wrapper = CircuitWrapper(pyquil_program=ExampleCircuits.pyquil_shor())
        show_figure(wrapper.circuit)

    def test_pyquil_export(self):
        wrapper = CircuitWrapper(qiskit_circuit=ExampleCircuits.qiskit_custom())
        pyquil = wrapper.export_pyquil()
        print(pyquil)

    def test_decompose(self):
        wrapper = CircuitWrapper(qiskit_circuit=ExampleCircuits.qiskit_unroll())
        wrapper.decompose_to_standard_gates()#
        
    def test_unroll(self):
        wrapper = CircuitWrapper(qiskit_circuit=ExampleCircuits.qiskit_unroll())
        wrapper.unroll(["u3", "u2", "cz"])
        # wrapper.unroll(["rz", "rx", "cx"])
        # wrapper.unroll(["rx", "rz"])

if __name__ == "__main__":
    test = TestCircuitWrapper()
    test.test_unroll()
