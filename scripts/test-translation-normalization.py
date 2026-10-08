import importlib.util
from pathlib import Path
import unittest

spec=importlib.util.spec_from_file_location('normalizer',Path(__file__).with_name('normalize-translation-cache.py'))
normalizer=importlib.util.module_from_spec(spec)
spec.loader.exec_module(normalizer)

class NormalizationTest(unittest.TestCase):
    def test_conjunction_is_exact_source_override(self):
        self.assertEqual(normalizer.normalize('es','or','or'),'o')
    def test_does_not_remove_r_from_spanish_words(self):
        sentence='Paneles decorativos para importadores: soporte de exportación y coordinación.'
        self.assertEqual(normalizer.normalize('es','Decorative panels',sentence),sentence)
    def test_preserves_brand(self):
        self.assertEqual(normalizer.normalize('es','FormSubmit','FormSubmit'),'FormSubmit')

if __name__=='__main__': unittest.main()
